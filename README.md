# generator-generate
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Personal yeoman generator for generating various starting project and code arhitecture for py, js, java.

## Installation

First, install [Yeoman](http://yeoman.io) and generator-generate using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-generate
```

Then generate your new project:

```bash
yo generate
```

## Generators feature

#### Defaults

Generators will set up next feature for all project templates:
 
 * testing environment,
 * build tool,
 * default project logo image,
 * continuous integration tool,
 * readme structure with badges and logo image,
 * default project files: (licence, history, contributing, authors, etc...),
 * default vcs files: (gitignore, gitmodules, etc...),
 * documentation environment,
 * project arhitecture: (tests,src, etc...),
 * environent configuration (test,development,production)
 
#### CLI (console line interface)

 * docopt,
 * ? database,
 * version reading from git,
 * auto deploy,
 
#### GUI (graphical user interface)

 * setup framework,
 * about framework
 * help framework,
 * ? database,
 * module base project,
 * auto deploy,
 * version reading from git


## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [Uros Jarc](https://github.com/urosjarc)


[npm-image]: https://badge.fury.io/js/generator-generate.svg
[npm-url]: https://npmjs.org/package/generator-generate
[travis-image]: https://travis-ci.org/urosjarc/generator-generate.svg?branch=master
[travis-url]: https://travis-ci.org/urosjarc/generator-generate
[daviddm-image]: https://david-dm.org/urosjarc/generator-generate.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/urosjarc/generator-generate
[coveralls-image]: https://coveralls.io/repos/urosjarc/generator-generate/badge.svg
[coveralls-url]: https://coveralls.io/r/urosjarc/generator-generate
