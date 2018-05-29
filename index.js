'use strict';

(() => {

  const promisePool = require('es6-promise-pool');
  const fetch = require('fetch-retry');
  const htmlparser = require('htmlparser');
  const moment = require('moment');

  module.exports = async (user, since, until, ora, console) => {
    ora = ora || (() => {
      return {
        start: function () { return this; },
        stop: () => {},
        succeed: () => {},
        warn: () => {},
      };
    });
    console = console || {
      log: () => {},
    };

    const joinDate = await getFirstDayAtGithub(user, ora);
    const result = await getContribs(user, joinDate, since, until, ora, console);
    return result;
  };

  const getFirstDayAtGithub = async (user, ora) => {
    const firstDaySpinner = ora('Fetching first day at GitHub...').start();

    const userInfo = await fetch(`https://api.github.com/users/${user}`);
    const userInfoJson = await userInfo.json();

    const result = stringToDate(userInfoJson.created_at);
    firstDaySpinner.succeed(`Fetched first day at GitHub: ${dateToString(result)}.`);
    return result;
  };

  const getContribs = async (user, joinDate, since, until, ora, console) => {
    const htmlToRepos = html => {
      const repos = new Set();

      const handler = new htmlparser.DefaultHandler((error, dom) => {});
      const parser = new htmlparser.Parser(handler);
      parser.parseComplete(html);
      for (let i = 0; i < handler.dom.length; ++i) {
        if (handler.dom[i].type == 'tag' && handler.dom[i].name == 'ul') {
          const ul = handler.dom[i].children;
          for (let j = 0; j < ul.length; ++j) {
            if (ul[j].type == 'tag' && ul[j].name == 'li') {
              const li = ul[j].children;
              for (let k = 0; k < li.length; ++k) {
                if (li[k].type == 'tag' && li[k].name == 'div') {
                  const div = li[k].children;
                  for (let l = 0; l < div.length; ++l) {
                    if (div[l].type == 'tag' && div[l].name == 'a') {
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
          const tooManyRequests = 429;
          const userCommits = await fetch(
            `https://github.com/users/${user}/created_commits?from=${currDateStr}&to=${currDateStr}`, {
              retryOn: [tooManyRequests],
              retries: 300,
            },
          );
          const userCommitsHtml = await userCommits.text();
          const repos = htmlToRepos(userCommitsHtml);
          commitsSpinner.stop(); // temporary stop for logging
          for (let repo of repos) {
            console.log(`${currDateStr}: ${repo}`);
            result.add(repo);
          }
          commitsSpinner.start(`Fetching all commits [${++numOfQueriedDays}/${numOfDaysToQuery}]`);
        })();
      };
    })();

    const numOfDaysToQuery = (newestDate - oldestDate) / (24 * 60 * 60 * 1000) + 1;

    const durationMsToQueryADay = 14000;
    let warning = `Be patient. The whole process might take up to ${moment.duration(numOfDaysToQuery * durationMsToQueryADay).humanize()}...`;
    if (!since && !until) {
      warning += ' Consider using `--since` and/or `--until`.';
    }
    ora(warning).warn();

    const result = new Set();
    const commitsSpinner = ora('Fetching all commits...').start();
    await new promisePool(getContribsOnOneDay, 5).start();
    commitsSpinner.succeed('Fetched all commits.');
    return result;
  };


  // See https://stackoverflow.com/a/28431880/1855917
  const stringToDate = (string) => {
    return new Date(`${string.substring(0, 10)}T00:00:00Z`);
  };
  const dateToString = (date) => {
    return date.toISOString().substring(0, 10);
  };

  // See https://stackoverflow.com/a/25114400/1855917
  const prevDay = (date) => {
    return new Date(date.getTime() - 24 * 60 * 60 * 1000);
  };

})();
