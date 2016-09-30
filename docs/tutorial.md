First follow [installation](#installation) section and install requirements.

####1. Generate your generator
Start GG2 with yeoman CLI to generate starting structure.

```
yo generator2
```

Command will generate your generator structure:
```
.
├── generators/
│   ├── app/
│   |   ├── USAGE
│   |   └── index.js
|   └── subgenerator/
|       ├── index.js
│       └── templates/
│           ├── base/
│           ├── module/
│           └── setup
|               ├── base/
|               ├── ejs/
|               └── injector/
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .eslintrc
├── .travis.yml
├── .yo-rc.json
├── package.json
├── gulpfile.js
├── README.md
├── LICENSE
└── test/
    └── app.js
```

####2. Customize promping
Open `generators/app/index.js` file and modify app questions.

**Warning:** `app.license` and `app.sugenerator` should stay the same, unless you know
what it means to delete those objects.

####3. Subgenerator arhitecture

Example of good arhitecture is located at
[urosjarc/generator-generate](https://github.com/urosjarc/generator-generate)

##### Name
Rename subgenerator directory in `generators/` folder.
You should name it something like `java` or `python`.

##### temp./base
Add folders in `<subgen>/templates/base` and name them something like
`server`, `lib`, `website` or `cli-tool`. Those folders will hold
project specific files.
    
##### temp./module
Add folders in `<subgen>/templates/module` and name them something like
`database`, `logger` or `docs`. Those folders will hold your project
specific files for modules.
    
##### temp./setup/bases
Add folders and files in `<subgen>/templates/setup/base`.
This folder will hold files and folders which all bases will use.
Here you should place `.gitignore`, `.editorconfig`, `.travis.yml`.
 
##### temp./setup/ejs
Add folders and files in `<subgen>/templates/setup/ejs`. Here you should
place files which will provide [EJS](http://www.embeddedjs.com/) template content for `setup/base`, `base`, `module`
folders and files.
 
For example file with path `<subgen>/templates/setup/ejs/readme/somedir/header` with content
`Hello world!` will be setup as [EJS](http://www.embeddedjs.com/) key `ejs.readme_somedir_header`. You can use EJS templating
system within `base/*`, `module/*`, and `setup/base/*`.
 
**Warnings:**
 
 * Path slashes (`/`) will be replaced with underscore characted (`_`).
 * There should always be `license` file in `ejs/` directory. Content
   of `license` file will be compiled when generator will run.
 * You can access prompt answeres joust like you setup questions for the prompt (`app.name`, `app.license`).

##### temp./setup/injector
Add yml files and name them with the same names as folders in `<subgen>/templates/module`.
When generator will be generating module you will want to inject files at specific line.

For example when generating module `database` you would want to inject lines in to your
`setup.py` or `build.gradle` with dependency information.

File `database.yml`:
```
./setup.py:
  flag: #Dependencies
  text: |-
    mysql
    mysql_connect
    
./package/__init__.py:
  flag: #Import
  text: |-
    import mysql
    import mysql_connect
```

Injector will inject text lines after flag at the **same indentation**!

##### subgen methods
After base or module generation specific method in `<subgen>/index.js`
with the same name as base or module will be executed. Here you can for example
install dependencies for generated project or test generated structure. 

####4. Start your generator
Then link this generator to start using it
```
npm link
yo <generator-name>
```
