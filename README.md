![Project logo](docs/media/header.png?raw=true)

<br>

[![npm release][npm]][npm-url]
[![Travis][travis]][travis-url]
[![Coverage Status][coverage]][coverage-url]
[![Dependency Status][dep]][dep-url]
[![Codebeat badge][codestyle]][codestyle-url]

[npm]: https://img.shields.io/npm/v/generator-generator2.svg
[npm-url]: https://www.npmjs.com/package/generator-generator2
[travis]: https://img.shields.io/travis/urosjarc/generator-generator2.svg
[travis-url]: https://travis-ci.org/urosjarc/generator-generator2
[coverage]: https://img.shields.io/codacy/coverage/71b26bbc68de46ed9b6ad037d821b635.svg
[coverage-url]: https://www.codacy.com/app/urosjarc/generator-generator2
[codestyle]: https://img.shields.io/codacy/grade/71b26bbc68de46ed9b6ad037d821b635.svg
[codestyle-url]: https://www.codacy.com/app/urosjarc/generator-generator2
[dep]: https://www.versioneye.com/user/projects/57ed5868769f21004138875f/badge.svg?style=flat-square
[dep-url]: https://www.versioneye.com/user/projects/57ed5868769f21004138875f
[support]: https://img.shields.io/badge/patreon-urosjarc-green.svg?style=social
[support-url]: https://patreon.com/urosjarc/
[twitter]: https://img.shields.io/twitter/follow/urosjarc.svg?style=social&label=follow
[twitter-url]: https://twitter.com/intent/follow?screen_name=urosjarc

> Yeoman 2nth generator with easier and opinionated workflow.

[![Patreon User][support]][support-url]
[![Twitter User][twitter]][twitter-url]

<br>

# !!! WARNING !!!
**Project is still in development!**
**Please see project [v1.0.0 milestone](https://github.com/urosjarc/generator-generator2/milestones)**
**to see when the first production ready version will come out.**

<br>

##Project website
Here is described general informations about the project.
For every thing else like `documentation`, `contribution` visit
[official website](https://urosjarc.github.io/generator-generator2) for this project.

##Informations

**What is yeoman?**

[Yeoman](http://yeoman.io/) is a generic scaffolding system allowing the creation of any kind of app.
It allows for rapidly getting started on new projects and streamlines the maintenance of existing projects.
Yeoman is language agnostic. It can generate projects in any language (Web, Java, Python, C#, etc.)

**generator-generator?**

Yeoman has default generator named [generator-generator](https://github.com/yeoman/generator-generator). 
With this generator user can make their own generator by extending [generator runtime context](http://yeoman.io/authoring/running-context.html)
methods to customize generation process of their projects. By default **GG** (generator-generator)
is unopinionated with some basic [utility methods](http://yeoman.io/generator/Base.html) which are more or less low level.
User must write code to make generator work.

**generator-generator2?**

**GG2** (generator-generator2) try to remove the need to write any code and make standardization how projects should
be generated and still leave option to customize runtime context, for hard core programmers. GG2 is build upon GG!

## Features

 * Provide [logging](https://www.npmjs.com/package/winston) for your generator.
 * [EJS templating](http://www.embeddedjs.com/) for **files** content and **directories** names.
 * **Line injector** for file content.
 * Provide [licenser](https://www.npmjs.com/package/licenser.js) for your generator.
 * **Prompt validation** on user input.
 * Etc... 
 
## Instalation
To use GG2 you must have [node.js](https://nodejs.org). If you have latest node
you can install yo and GG2 packages.

```
#Install yeoman cli tool.
npm install -g yo

#Install generator.
npm install -g generator-generator2
```

## Usage


```
Run generator.
yo generator2

#Creates generator.debug file while running generator.
yo generator2 --debug
```

## License
Copyright © 2016 Uroš Jarc

MIT License