'use strict';

(() => {

  const PromisePool = require('es6-promise-pool');
  const fetch = require('fetch-retry');
  const htmlparser = require('htmlparser');
  const moment = require('moment');

  const fetchContribs = async (user, since, until, ora, console) => {
    ora = ora || (() => {
      return {
        start() { return this; },
        stop() {},
        succeed() {},
        warn() {},
      };
    });
    console = console || {
      log: () => {},
    };

    const joinDate = await getFirstDayAtGithub(user, ora);
    const result = await getContribs(user, joinDate, since, until, ora, console);
    return result;
  };

  // See https://stackoverflow.com/a/28431880/1855917
  const stringToDate = string => {
    return new Date(`${string.substring(0, 10)}T00:00:00Z`);
  };
  const dateToString = date => {
    return date.toISOString().substring(0, 10);
  };

  module.exports = {
    fetch: fetchContribs,
    stringToDate,
    dateToString
  };

  const fetchRetry = url => {
    const tooManyRequests = 429;
    return fetch(url, {
      retryOn: [tooManyRequests],
      retries: 300,
    });
  };

  const getFirstDayAtGithub = async (user, ora) => {
    let urlSuffix = '';
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      console.log('GitHub API key found.');
      urlSuffix = `?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`;
    }

    const firstDaySpinner = ora('Fetching first day at GitHub...').start();

    let error = false;
    let userInfoJson;
    try {
      const userInfo = await fetchRetry(`https://api.github.com/users/${user}${urlSuffix}`);
      userInfoJson = await userInfo.json();
    } catch (_) {
      // This error handling should be the least verbose possible in order not to leak the API key
      // by just having the URL printed.
      error = true;
    }
    if (error || !userInfoJson.created_at) {
      firstDaySpinner.stop();
      throw new Error('Failed to fetch first day at GitHub.');
    }

    const result = stringToDate(userInfoJson.created_at);
    firstDaySpinner.succeed(`Fetched first day at GitHub: ${dateToString(result)}.`);
    return result;
  };

  const getContribs = async (user, joinDate, since, until, ora, console) => {
    const commitsHtmlToRepos = html => {
      const repos = new Set();

      const handler = new htmlparser.DefaultHandler((error, dom) => {});
      const parser = new htmlparser.Parser(handler);
      parser.parseComplete(html);
      for (let i = 0; i < handler.dom.length; ++i) {
        if (handler.dom[i].type === 'tag' && handler.dom[i].name === 'ul') {
          const ul = handler.dom[i].children;
          for (let j = 0; j < ul.length; ++j) {
            if (ul[j].type === 'tag' && ul[j].name === 'li') {
              const li = ul[j].children;
              for (let k = 0; k < li.length; ++k) {
                if (li[k].type === 'tag' && li[k].name === 'div') {
                  const div = li[k].children;
                  for (let l = 0; l < div.length; ++l) {
                    if (div[l].type === 'tag' && div[l].name === 'a') {
                      const a = div[l].children[0].data;
                      if (!a.includes(' ')) {
                        repos.add(a);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return repos;
    };

    const prsHtmlToRepos = html => {
      const repos = new Set();

      const handler = new htmlparser.DefaultHandler((error, dom) => {});
      const parser = new htmlparser.Parser(handler);
      parser.parseComplete(html);
      for (let i = 0; i < handler.dom.length; ++i) {
        if (handler.dom[i].type === 'tag' && handler.dom[i].name === 'div') {
          const div1 = handler.dom[i].children;
          for (let j = 0; j < div1.length; ++j) {
            if (div1[j].type === 'tag' && div1[j].name === 'div') {
              const div2 = div1[j].children;
              for (let k = 0; k < div2.length; ++k) {
                if (div2[k].type === 'tag' && div2[k].name === 'button') {
                  const button = div2[k].children;
                  for (let l = 0; l < button.length; ++l) {
                    if (button[l].type === 'tag' && button[l].name === 'span') {
                      const span = button[l].children[0].data.trim();
                      if (span) {
                        repos.add(span);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return repos;
    };

    let oldestDate = joinDate;
    if (since) {
      oldestDate = new Date(Math.max(oldestDate, stringToDate(since)));
    }

    const today = stringToDate(dateToString(new Date())); // get rid of hh:mm:ss.mmmm
    let newestDate = today;
    if (until) {
      newestDate = new Date(Math.min(newestDate, stringToDate(until)));
    }

    const getContribsOnOneDay = (() => {
      let currDate = newestDate;
      let numOfQueriedDays = 0;
      return () => {
        if (currDate < oldestDate) {
          return null;
        }
        const currDateStr = dateToString(currDate);
        currDate = prevDay(currDate);

        return (async () => {
          const userCommits = await fetchRetry(
            `https://github.com/users/${user}/created_commits?from=${currDateStr}&to=${currDateStr}`
          );
          const userCommitsHtml = await userCommits.text();
          const userPRs = await fetchRetry(
            `https://github.com/users/${user}/created_pull_requests?from=${currDateStr}&to=${currDateStr}`,
          );
          const userPRsHtml = await userPRs.text();
          const commitsRepos = commitsHtmlToRepos(userCommitsHtml);
          const prsRepos = prsHtmlToRepos(userPRsHtml);
          progressSpinner.stop(); // temporary stop for logging
          for (const repo of commitsRepos) {
            console.log(`${currDateStr}: (commits) ${repo}`);
            result.add(repo);
          }
          for (const repo of prsRepos) {
            console.log(`${currDateStr}: (PRs)     ${repo}`);
            result.add(repo);
          }
          progressSpinner.start(`Fetching all commits and PRs [${++numOfQueriedDays}/${numOfDaysToQuery}]`);
        })();
      };
    })();

    const numOfDaysToQuery = ((newestDate - oldestDate) / (24 * 60 * 60 * 1000)) + 1;

    const durationMsToQueryADay = 3500;
    let warning = `Be patient. The whole process might take up to ${moment.duration(numOfDaysToQuery * durationMsToQueryADay).humanize()}...`;
    if (!since && !until) {
      warning += ' Consider using --since and/or --until';
    }
    ora(warning).warn();

    const result = new Set();
    const progressSpinner = ora('Fetching all commits and PRs...').start();
    await new PromisePool(getContribsOnOneDay, 5).start();
    progressSpinner.succeed('Fetched all commits and PRs.');
    return result;
  };

  // See https://stackoverflow.com/a/25114400/1855917
  const prevDay = date => {
    return new Date(date.getTime() - (24 * 60 * 60 * 1000));
  };

})();
