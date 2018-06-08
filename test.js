import test from 'ava';
import m from '.';

test('fetches commits and PRs', async t => {
  /* AurelienLourot had the following activity:
     * 2017-08-26: nothing
     * 2017-08-27: 14 commits in AurelienLourot/mybeir.ut
     * 2017-08-28: 1 PR in tt-gf/ant-ivy */

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

  const result = await m('AurelienLourot', '2017-08-26', '2017-08-28', ora, console);
  t.is(result.size, 2);
  t.true(result.has('AurelienLourot/mybeir.ut'));
  t.true(result.has('tt-gf/ant-ivy'));
});
