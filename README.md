[![npm][npm-image]][npm-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/pmnps.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/pmnps
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

# pmnps-dependencies-detect-plugin

`pmnps` is a monorepo tool, it uses `npm workspaces` to manage packages and platforms. This `plugin` is for detecting package dependencies error.

## Other language

[中文](https://github.com/filefoxper/pmnps/blob/master/README_zh.md)

## Install

```
npm install pmnps-dependencies-detect-plugin --save-dev
```

## Basic usage

Config the `.pmnpsrc.json`.

```
{
    "workspace":"workspace",
    "git":true,
    "lock":true,
    "plugins":[
        "pmnps-dependencies-detect-plugin"
    ]
}
```
