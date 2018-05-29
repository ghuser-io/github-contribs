# github-contribs

List **all** GitHub repos a user has contributed to **since the beginning of time**:

* not just the last few months,
* not just the repos owned by the user or their organisations.

```bash
$ github-contribs AurelienLourot
✔ Fetched first day at GitHub: 2015-04-04.
⚠ Be patient. The whole process might take up to 4 hours... Consider using `--since`.
✔ Fetched all commits.
35 repo(s) found:
AurelienLourot/lsankidb
dracula/gitk
reframejs/reframe
...
```

## Installation

> In construction. Not available on npm yet. For now do
>
> ```bash
> $ git clone https://github.com/AurelienLourot/github-contribs.git
> $ cd github-contribs/
> $ yarn install
> $ ./cli.js AurelienLourot
> ```


```bash
$ sudo npm install -g github-contribs
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
