#!/usr/bin/env node
'use strict';

(async () => {

  const meow = require('meow');
  const ora = require('ora');

  const githubContribs = require('./');

  const cli = meow(`
usage:
  $ github-contribs [--quiet|--verbose] [--since YYYY-MM-DD] [--until YYYY-MM-DD] USER
  $ github-contribs --help
  $ github-contribs --version

positional arguments:
  USER        GitHub username, e.g. AurelienLourot

optional arguments:
  --quiet              do not show progress while querying GitHub, only the final result
  --verbose            show debugging information
  --since YYYY-MM-DD   limit the results (default: first day at GitHub)
  --until YYYY-MM-DD   limit the results (default: today)
  --version            show program's version number and exit
  --help               show this help message and exit
`, {
  boolean: [
    'quiet',
    'verbose',
  ],
  string: [
    'since',
    'until',
  ],
});

  if (cli.flags.quiet && cli.flags.verbose) {
    console.error('Error: --quiet and --verbose are mutually exclusive. See `github-contribs --help`.');
    process.exit(1);
  }

  if (cli.input.length < 1) {
    console.error('Error: USER argument missing. See `github-contribs --help`.');
    process.exit(1);
  }

  if (cli.input.length > 1) {
    console.error('Error: too many positional arguments. See `github-contribs --help`.');
    process.exit(1);
  }

  const user = cli.input[0];
  const repos = await githubContribs(user, cli.flags.since, cli.flags.until,
                                     !cli.flags.quiet && ora, cli.flags.verbose && console);
  if (!cli.flags.quiet) {
    console.log(`${repos.size} repo(s) found:`);
  }
  for (let repo of repos) {
    console.log(repo);
  }

})();
