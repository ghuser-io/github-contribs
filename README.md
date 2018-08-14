[![Build Status](https://travis-ci.org/AurelienLourot/github-contribs.svg?branch=master)](https://travis-ci.org/AurelienLourot/github-contribs)
[![Coverage Status](https://codecov.io/gh/AurelienLourot/github-contribs/branch/master/graph/badge.svg)](https://codecov.io/gh/AurelienLourot/github-contribs)
[![npm version](https://rawgit.com/AurelienLourot/github-contribs/master/thirdparty/badges/npm.svg)](https://www.npmjs.com/package/@ghuser/github-contribs)
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)

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
✔ Fetched all commits and PRs. Consider using --issues to fetch issues as well.
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
| [<img src="https://avatars1.githubusercontent.com/u/11795312?v=4" width="100px;"/><br /><sub><b>Aurelien Lourot</b></sub>](https://ghuser.io/AurelienLourot)<br />[💬](#question-AurelienLourot "Answering Questions") [💻](https://github.com/AurelienLourot/github-contribs/commits?author=AurelienLourot "Code") [📖](https://github.com/AurelienLourot/github-contribs/commits?author=AurelienLourot "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/15092?v=4" width="100px;"/><br /><sub><b>John Vandenberg</b></sub>](https://jayvdb.github.io/)<br />[🐛](https://github.com/AurelienLourot/github-contribs/issues?q=author%3Ajayvdb "Bug reports") [🤔](#ideas-jayvdb "Ideas, Planning, & Feedback") | [<img src="https://avatars1.githubusercontent.com/u/1057635?v=4" width="100px;"/><br /><sub><b>Jeaye Wilkerson</b></sub>](https://jeaye.com)<br />[🐛](https://github.com/AurelienLourot/github-contribs/issues?q=author%3Ajeaye "Bug reports") |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

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
* https://github.com/users/AurelienLourot/created_issues?from=2018-07-10&to=2018-07-10

So we're doing the same :)

> **NOTE**: it seems like `created_issues` URLs don't deliver "hot issues" (issues which received
> more comments than others):
>
> ```bash
> $ curl -s "https://github.com/users/AurelienLourot/created_issues?from=2015-09-23&to=2015-09-23"
> <div class="profile-rollup-content">
> </div>
> ```
>
> To get these, we also query the profile itself:
>
> ```bash
> $ curl -s "https://github.com/AurelienLourot?from=2015-09-23" | grep issues/
>         <a class="text-gray-dark" href="/jfrog/build-info/issues/60">Publish properties aren&#39;t used by build-info-extractor-gradle?</a>
> ```

### Why is it so slow?

We hit a [rate limit](https://en.wikipedia.org/wiki/Rate_limiting). And since it's not an official
API, we can't use a token to raise the limit.

### Isn't it likely to break?

Yes, it is since that interface isn't public. We're monitoring it<sup>[1](#footnote1)</sup> and will
react as fast as we can when it breaks.

<a name="footnote1"><sup>1</sup></a> [ghuser.io](https://github.com/AurelienLourot/ghuser.io) runs
this tool every day.<br/>

### `github-contribs` missed some of my commits. Why?

`github-contribs` can only discover commits considered as
[GitHub contributions](https://help.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile/#commits),
i.e. commits that would also appear in the activity section of your GitHub profile. For example it
doesn't discover commits is forks.

## Changelog

**2.2.0** (2018-08-09):
  * [#1](https://github.com/AurelienLourot/github-contribs/issues/1) - Added `--issues` flag.

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
