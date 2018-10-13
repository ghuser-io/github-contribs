import test from 'ava';
import m from '.';

const ora = string => {
  if (string) {
    console.log(string);
  }
  return {
    start(string) {
      if (string) {
        console.log(string);
      }
      return this;
    },
    stop() {},
    succeed(string) {
      if (string) {
        console.log(string);
      }
    },
    warn() {},
  };
};

test('fetches commits and PRs', async t => {
  /* AurelienLourot had the following activity:
     * 2017-08-26: nothing
     * 2017-08-27: 14 commits in AurelienLourot/mybeir.ut
     * 2017-08-28: 1 PR in tt-gf/ant-ivy */

  const result = await m.fetch('AurelienLourot', '2017-08-26', '2017-08-28', ora, console);

  // Because AurelienLourot had no activity on 2017-08-26, GitHub chooses to display older activity
  // on his profile, namely a PR for `brandon-rhodes/uncommitted` on 2017-07-08. This is a known
  // limitation and we think it's better to discover too much than not enough.

  t.is(result.size, 3);
  t.true(result.has('AurelienLourot/mybeir.ut'));
  t.true(result.has('tt-gf/ant-ivy'));
  t.true(result.has('brandon-rhodes/uncommitted'));
});

test('fetches issues', async t => {
  /* RichardLitt had the following activity:
     * 2018-08-07: 1 issue in orbitdb/welcome */

  const result = await m.fetch('RichardLitt', '2018-08-07', '2018-08-07', ora, console, true);
  t.is(result.size, 1);
  t.true(result.has('orbitdb/welcome'));
});

test('fetches hot issues', async t => {
  /* AurelienLourot had the following activity:
     * 2015-09-23: 1 commit in AurelienLourot/AurelienLourot.github.io
                   1 hot issue in jfrog/build-info */

  const result = await m.fetch('AurelienLourot', '2015-09-23', '2015-09-23', ora, console, true);
  t.is(result.size, 2);
  t.true(result.has('AurelienLourot/AurelienLourot.github.io'));
  t.true(result.has('jfrog/build-info'));
});
