# Release a new version

## Run all the checks

```bash
$ npm test
```

## Increase the version number

In [package.json](package.json) to `7.8.9` in this example.

## Extend the changelog

In [README.md](README.md#changelog).

## Generate the package to be published

```bash
$ npm pack
```

And check that the resulting `ghuser-github-contribs-7.8.9.tgz` looks well-formed. Finally clean up:

```bash
$ rm ghuser-github-contribs-7.8.9.tgz
```

## Install the package locally

```bash
$ sudo npm install . -g
```

and test it briefly, e.g.

```bash
$ github-contribs --version
$ github-contribs --since 2018-05-29 AurelienLourot
```

## Commit your changes, create a git tag and push

```bash
$ git commit -am "Version 7.8.9"
$ git push
$ git tag "7.8.9"
$ git push --tags
```

## Publish the package

```bash
$ npm login --scope=@ghuser
Username: lourot
...
$ npm publish
```

> **NOTES**:
>
> * If it fails with 301, see
>   [publish - npm login error 301](https://stackoverflow.com/a/50580349/1855917).
> * On the first publication do `npm publish --access public` instead.

and check that the package looks well-formed at
`https://www.npmjs.com/package/@ghuser/github-contribs/v/7.8.9`

Finally check that the package can be installed from npm:

```bash
$ sudo npm uninstall -g @ghuser/github-contribs
$ sudo npm install -g @ghuser/github-contribs
```

## Add release notes

to [https://github.com/AurelienLourot/github-contribs/tags](https://github.com/AurelienLourot/github-contribs/tags)

## Update the cache of flaky badges

```bash
$ cd thirdparty/badges/
$ ./download.sh # and check that the badges look good
$ git commit -am "Updated flaky badges."
$ git push
```
