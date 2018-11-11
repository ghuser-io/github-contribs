[![Build Status](https://travis-ci.org/ghuser-io/github-contribs.svg?branch=master)](https://travis-ci.org/ghuser-io/github-contribs)
[![Coverage Status](https://codecov.io/gh/ghuser-io/github-contribs/branch/master/graph/badge.svg)](https://codecov.io/gh/ghuser-io/github-contribs)
[![npm version](https://cdn.jsdelivr.net/gh/ghuser-io/github-contribs@45f6a0a0d6a76a49408841a26ee8d7e608b00c8c/thirdparty/badges/npm.svg)](https://www.npmjs.com/package/@ghuser/github-contribs)
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors)

[<img src="https://cdn.jsdelivr.net/gh/ghuser-io/github-contribs@45f6a0a0d6a76a49408841a26ee8d7e608b00c8c/thirdparty/octicons/repo.svg" align="left" width="64" height="64">](https://github.com/ghuser-io/github-contribs)

# github-contribs

List **all** GitHub repos a user has contributed to **since the beginning of time**:

* not just the last few months,
* not just the repos owned by the user or their organisations,
* simply all repos a user has ever pushed to.

```bash
$ github-contribs AurelienLourot
✔ Fetched first day at GitHub: 2015-04-04.
⚠ Be patient. The whole process might take up to an hour... Consider using --since and/or --until
✔ Fetched all commits and PRs. Consider using --issues to fetch issues as well.
35 repo(s) found:
AurelienLourot/lsankidb
reframejs/reframe
dracula/gitk
...
```

⇒ [Advanced usage](https://github.com/ghuser-io/github-contribs/tree/master/docs/advanced.md)

## Installation

```bash
$ sudo npm install -g @ghuser/github-contribs
```

## Contributing

### To the code

To run your local changes:

```bash
$ yarn install
$ ./cli.js --help
```

### Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/11795312?v=4" width="100px;"/><br /><sub><b>Aurelien Lourot</b></sub>](https://ghuser.io/AurelienLourot)<br />[💬](#question-AurelienLourot "Answering Questions") [💻](https://github.com/ghuser-io/github-contribs/commits?author=AurelienLourot "Code") [📖](https://github.com/ghuser-io/github-contribs/commits?author=AurelienLourot "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/15092?v=4" width="100px;"/><br /><sub><b>John Vandenberg</b></sub>](https://jayvdb.github.io/)<br />[🐛](https://github.com/ghuser-io/github-contribs/issues?q=author%3Ajayvdb "Bug reports") [🤔](#ideas-jayvdb "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/1057635?v=4" width="100px;"/><br /><sub><b>Jeaye Wilkerson</b></sub>](https://jeaye.com)<br />[🐛](https://github.com/ghuser-io/github-contribs/issues?q=author%3Ajeaye "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/18241007?v=4" width="100px;"/><br /><sub><b>Hagar Shilo</b></sub>](http://mandala.hagarsh.com)<br />[🤔](#ideas-strayblues "Ideas, Planning, & Feedback") | [<img src="https://avatars2.githubusercontent.com/u/1005638?v=4" width="100px;"/><br /><sub><b>Romuald Brillout</b></sub>](https://twitter.com/brillout)<br />[🤔](#ideas-brillout "Ideas, Planning, & Feedback") |
| :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

> **NOTE**: if you should be on the list of contributors but we forgot you, don't be shy and let us
> know!

## FAQ

### How does it work?

Normally in order to retrieve all repositories a user has interacted with, one should query the
[GitHub Events API](https://stackoverflow.com/a/37554614/1855917). Unfortunately it returns
[only the last 90 days](https://stackoverflow.com/a/38274468/1855917), so we don't use it.

Instead we noticed that the "Contribution Activity" section's content on the
[profile pages](https://github.com/AurelienLourot) comes from URLs like
https://github.com/AurelienLourot?from=2018-10-09 .

So we're fetching these URLs too and parsing their output.

### Why is it so slow?

We hit a [rate limit](https://en.wikipedia.org/wiki/Rate_limiting). And since it's not an official
API, we can't use a token to raise the limit.

> **NOTE**: the rate limit seems to be 40 requests / minute / endpoint / IP. Thus even if crawling a
> single user takes about 3 hours on a single machine, crawling many users in parallel on that same
> machine should still take about 3 hours.

### Isn't it likely to break?

Yes, it is since that interface isn't public. We're monitoring it<sup>[1](#footnote1)</sup> and will
react as fast as we can when it breaks.

<a name="footnote1"><sup>1</sup></a> [ghuser.io](https://github.com/ghuser-io/ghuser.io) runs
this tool every day.<br/>

### `github-contribs` missed some of my commits. Why?

`github-contribs` can only discover commits considered as
[GitHub contributions](https://help.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile/#commits),
i.e. commits that would also appear in the activity section of your GitHub profile. For example it
doesn't discover commits in forks.

## Changelog

**2.2.4** (2018-11-11):
  * [ghuser-io/ghuser.io#172](https://github.com/ghuser-io/ghuser.io/issues/172) Fix after GitHub's
    interface has changed. The `created_issues` "endpoint" is gone.

**2.2.3** (2018-10-20):
  * [ghuser-io/ghuser.io#172](https://github.com/ghuser-io/ghuser.io/issues/172) Fix after GitHub's
    interface has changed. The `created_commits` "endpoint" is gone.

**2.2.2** (2018-10-13):
  * [ghuser-io/ghuser.io#172](https://github.com/ghuser-io/ghuser.io/issues/172) Fix after GitHub's
    interface has changed. The `created_pull_requests` "endpoint" is gone.

**2.2.1** (2018-09-15):
  * Documentation improvements.

**2.2.0** (2018-08-09):
  * [#1](https://github.com/ghuser-io/github-contribs/issues/1) - Added `--issues` flag.

**2.1.0** (2018-06-25):
  * Exported helper function `prevDay()`.

**2.0.0** (2018-06-25):
  * Exported helper functions `stringToDate()` and `dateToString()`.

**1.0.0** (2018-06-11):
  * Support for passing a GitHub API key.

**0.0.2** (2018-05-29):
  * Cosmetic improvements to the [npm page](https://www.npmjs.com/package/@ghuser/github-contribs).

**0.0.1** (2018-05-29):
  * Initial version.

## Similar/Related projects

* [GitHub-contributions](https://github.com/faheel/GitHub-contributions): uses a different
  technique. It fetches all the user's pull requests from the official API. This is clever but will
  miss the repos to which the user has pushed directly without pull request.
* [gharchive.org](https://www.gharchive.org/): records all GitHub events for all users. In theory it
  should be possible to replace our implementation by queries to this huge database.
