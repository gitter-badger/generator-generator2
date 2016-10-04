<img style="float: center;" src="media/header.png">

## <%-app.name%>

<br>

[![npm release][npm]][npm-url]
[![Travis][travis]][travis-url]
[![Coverage Status][coverage]][coverage-url]
[![Dependency Status][dep]][dep-url]
[![Codebeat badge][codestyle]][codestyle-url]

[npm]: https://img.shields.io/npm/v/<%-app.name%>.svg
[npm-url]: https://www.npmjs.com/package/<%-app.name%>
[travis]: https://img.shields.io/travis/<%-app.githubUser%>/<%-app.name%>.svg
[travis-url]: https://travis-ci.org/<%-app.githubUser%>/<%-app.name%>
[coverage]: https://img.shields.io/codacy/coverage/<TOKEN>.svg
[coverage-url]: https://www.codacy.com/app/<%-app.githubUser%>/<%-app.name%>
[codestyle]: https://img.shields.io/codacy/grade/<TOKEN>.svg
[codestyle-url]: https://www.codacy.com/app/<%-app.githubUser%>/<%-app.name%>
[dep]: https://www.versioneye.com/user/projects/<TOKEN>/badge.svg?style=flat-square
[dep-url]: https://www.versioneye.com/user/projects/<TOKEN>
[support]: https://img.shields.io/badge/patreon-<%-app.patreonUser%>-green.svg?style=social
[support-url]: https://patreon.com/<%-app.patreonUser%>/
[twitter]: https://img.shields.io/twitter/follow/<%-app.twitterUser%>.svg?style=social&label=follow
[twitter-url]: https://twitter.com/intent/follow?screen_name=<%-app.twitterUser%>

> Yeoman 2nth generator with easier and opinionated workflow.

[![Patreon User][support]][support-url]
[![Twitter User][twitter]][twitter-url]

<br>

!!! Warning
    Project is still in development!
    Please see project [milestones](<%-app.repoUrl%>/milestones)
    to see when the first production ready version will come out. 
    
<br>

##Informations

<!-- Todo: add informations -->

## Features

<!--- Todo: add features list -->
 
## Instalation
To use generator you must have [node.js](https://nodejs.org). If you have latest node
you can install yo and generator packages.

```
#Install yeoman cli tool.
npm install -g yo

#Install generator.
npm install -g <%-app.name%>
```

## Usage


```
Run generator.
yo <%-app.name%> 

#Creates generator.debug file while running generator.
yo <%-app.name%> --debug
```

## License
Copyright © <%-createdAt.split('.')[2]%> <%-app.authorName%>

