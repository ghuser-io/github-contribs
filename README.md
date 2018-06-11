[![Build Status](https://travis-ci.org/AurelienLourot/github-contribs.svg?branch=master)](https://travis-ci.org/AurelienLourot/github-contribs)
[![Coverage Status](https://codecov.io/gh/AurelienLourot/github-contribs/branch/master/graph/badge.svg)](https://codecov.io/gh/AurelienLourot/github-contribs)
[![npm version](https://rawgit.com/AurelienLourot/github-contribs/master/thirdparty/badges/npm.svg)](https://www.npmjs.com/package/@ghuser/github-contribs)

[<img src="https://rawgit.com/AurelienLourot/github-contribs/master/thirdparty/octicons/repo.svg" align="left" width="64" height="64">](https://github.com/AurelienLourot/github-contribs)

# github-contribs

List **all** GitHub repos a user has contributed to **since the beginning of time**:

* not just the last few months,
* not just the repos owned by the user or their organisations,
* simply all repos a user has ever pushed to.

```bash
$ github-contribs AurelienLourot
✔ Fetched first day at GitHub: 2015-04-04.
⚠ Be patient. The whole process might take up to an hour... Consider using --since and/or --until
✔ Fetched all commits and PRs.
35 repo(s) found:
AurelienLourot/lsankidb
reframejs/reframe
dracula/gitk
...
```

⇒ [Advanced usage](https://github.com/AurelienLourot/github-contribs/tree/master/docs/advanced.md)

## Installation

```bash
$ sudo npm install -g @ghuser/github-contribs
```

## Contributing

To run your local changes:

```bash
$ yarn install
$ ./cli.js --help
```

## Team

This project is maintained by the following person(s) and a bunch of
[awesome contributors](https://github.com/AurelienLourot/github-contribs/graphs/contributors).

[![AurelienLourot](https://avatars0.githubusercontent.com/u/11795312?v=4&s=70)](https://github.com/AurelienLourot) |
--- |
[Aurelien Lourot](https://github.com/AurelienLourot) |

## FAQ

### How does it work?

Normally in order to retrieve all repositories a user has interacted with, one should query the
[GitHub Events API](https://stackoverflow.com/a/37554614/1855917). Unfortunately it returns
[only the last 90 days](https://stackoverflow.com/a/38274468/1855917), so we don't use it.

Instead we noticed that the "Contribution Activity" on the
[profile pages](https://github.com/AurelienLourot) queries such URLs in the background:

* https://github.com/users/AurelienLourot/created_commits?from=2018-05-17&to=2018-05-17
* https://github.com/users/AurelienLourot/created_repositories?from=2018-05-17&to=2018-05-17
* https://github.com/users/AurelienLourot/created_pull_requests?from=2018-05-17&to=2018-05-17
* https://github.com/users/AurelienLourot/created_pull_request_reviews?from=2018-05-17&to=2018-05-17

So we're doing the same :)

### Why is it so slow?

We hit a [rate limit](https://en.wikipedia.org/wiki/Rate_limiting). And since it's not an official
API, we can't use a token to raise the limit.

### Isn't it likely to break?

Yes, it is since that interface isn't public. We're monitoring it and will react as fast as we can
when it breaks.

## Changelog

**1.0.0** (2018-06-11):
  * Support for passing a GitHub API key.

**0.0.2** (2018-05-29):
  * Cosmetic improvements to the [npm page](https://www.npmjs.com/package/@ghuser/github-contribs).

**0.0.1** (2018-05-29):
  * Initial version.
