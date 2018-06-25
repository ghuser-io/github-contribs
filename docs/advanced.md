# Advanced usage

## Passing a GitHub API key

Although we're not using [GitHub's public API](https://developer.github.com/v3/) for most operations
(see [FAQ](README.md#how-does-it-work)), we are still using it a bit, e.g. for fetching the day at
which the user has joined GitHub. So it's still worth
[creating an API key](https://github.com/settings/developers) and passing it:

```bash
$ export GITHUB_CLIENT_ID=0123456789abcdef0123
$ export GITHUB_CLIENT_SECRET=0123456789abcdef0123456789abcdef01234567
$ github-contribs AurelienLourot
GitHub API key found.
✔ Fetched first day at GitHub: 2015-04-04.
⚠ Be patient. The whole process might take up to an hour... Consider using --since and/or --until
✔ Fetched all commits and PRs.
35 repo(s) found:
AurelienLourot/lsankidb
reframejs/reframe
dracula/gitk
...
```

## Using in a JavaScript project

```js
(async () => {

  const githubContribs = require('@ghuser/github-contribs');
  const ora = require('ora');

  const repos = await githubContribs(
    'AurelienLourot', // username
    '2018-06-25',     // --since
    null,             // --until
    ora
  );
  for (const repo of repos) {
    console.log(repo);
  }

})();
```
