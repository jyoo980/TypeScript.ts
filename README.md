# TypeScript.ts ![build-status](https://gitlab.com/jamesyoo/TypeScript-ts/badges/master/pipeline.svg)

This is a repository for CPSC 410: Advanced Software Engineering. This DSL should enable developers to generate/bootstrap TypeScript projects from scratch using a small grammar. Development is currently in the early phases, so changes to this repo will be constant.

## Dependencies
* yarn (>= v1.17.3)
* tsc (>= 3.6.3)

## Demo

1. Navigate to `TypeScript.ts/ui`
2. Run `tsc TypeScript.ts`
3. Run `node TypeScript.js simpleProgramClass.txt`

## Working with ts-dsl

* To build: `yarn build`
* To execute all tests: `yarn test`

## Contributors

* [Sam Veloso](https://github.com/scveloso)
* [Slava Uryumtsev](https://github.com/uslava77)
* [David Li](https://github.com/daviidli)
* [Kiyomi KH](https://github.com/kiyomih)
* [James Yoo](https://github.com/jyoo980)

## Grammar

```
PROGRAM         ::= ‘project’ str nl (MODULE nl)? (DIR|CLASS|INTERFACE)*
MODULE          ::= ‘modules’ STRLIST				# should have quotes
DIR             ::= ‘dir’ str nl (ind (DIR|CLASS|INTERFACE) ded)* nl
CLASS           ::= ABS? ‘class’ str IMP? EXT? (nl COMMENT)? (nl FIELD)* (nl FUNC)* nl
INTERFACE       ::= ‘interface’ str EXT? (nl COMMENT)? (nl FIELD)* (nl FUNC)* nl
FIELD           ::= ind ‘fields’ mod? VARLIST (nl ind 'generate' gen)* ded
FUNC            ::= ind ‘function ’ mod ‘async ’? 'static'? str (nl ind COMMENT)? (nl PARAM)? (nl ind 'returns' type)? ded
PARAM           ::= ind ‘params ’ VARLIST ded
COMMENT         ::= ind ‘comments ’ STRLIST ded
ABS             ::= ‘abstract’
IMP             ::= ‘implements’ str (‘,’ str)*
EXT             ::= ‘extends’ str
VARLIST         ::= ‘[ ’ (type str (‘,’ type str))? ‘ ]’
STRLIST         ::= ‘[ ‘ str (‘,’ str)* ‘ ]’
gen             ::= (‘getters’ | ‘setters’)
mod             ::= (‘private’ | ‘public’| ‘protected’)
type            ::= (‘number’ | ‘boolean’| ‘string’ | str) sp
str             ::= [^\n]* sp # note strings outside of comments cannot have spaces as well.
sp              ::= ‘ ’
nl              ::= [\n]+
ind             ::= [\t | ]+    # tab(s) or single space(s)
ded             ::= [] # this is a dedent
```

## Documentation

### What does our language do?
Our DSL makes it possible to bootstrap TypeScript projects given a specification. If you have an idea of what methods a class or interface should have, and where it should live in the structure of your project, our DSL makes it possible for you to generate these classes + method stubs without having to open an IDE and click around in the file explorer.

### What can I do?
#### Specify project name(s):
You can specify the project’s name, for example: 

`project Transit`

#### Add external dependencies to the project:
You can specify any npm modules that you want to include in your project. For example:

`modules [“@types/node”, “chai”, “@types/chai”, “mocha”, “@types/mocha”]`

Will add the latest version of these dependencies to the project’s package.json.

#### Specify project structure and directories:
You can specify project structure using indentation. For example:

```
dir src
	class Time
	dir TransitModels
dir tests
````

Specifies that the project has the src and test directories at the project root directory level, and inside the src directory, is the Time class, and an empty directory, TransitModels.
#### Add a class/ interface specification to the project:
You can specify class/interface names, inheritance, fields, and function stubs (see below). For example:
```
	class Line implements TransitLine
		fields private [string name, string lineNumber, Stop[] stops]
			generate getters
			generate setters
		function public constructor
			comments [
				“Constructor method for TransitLine”,
				"@param name - name of transit line",
				"@param lineNumber - number of transit line",
				"@param stops - array of stops",
				“@returns TransitLine”
			]
			params [string name, string lineNumber, Stop[] stops]
			returns TransitLine
```
Defines a class, Line that implements the TransitLine interface. This class has the private fields: name, lineNumber, and stops, with getters and setters generated for all fields upon project creation. 

On top of implementing function stubs defined in the TransitLine interface, the Line class also has a constructor function defined. Read below for more details on function stub specifications.
#### Specify a function stub:
You can define function stubs under interfaces/ classes. For example: 

		function public constructor
			comments [
				“Constructor method for TransitLine”,
				"@param name - name of transit line",
				"@param lineNumber - number of transit line",
				"@param stops - array of stops",
				“@returns TransitLine”
			]
			params [string name, string lineNumber, Stop[] stops]
			returns TransitLine

Defines a constructor for TransitLine that accepts the name, lineNumber and stops parameters, and is annotated with a multi-line, TSDoc style comment for the function.

#### Add modifiers:
It is also possible to declare async/static functions by including the async/static keyword in the function definition:

```
function public async static move
	params [Location dest?]
```
