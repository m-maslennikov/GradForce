readme file is must have for any project. entrance for all developers. should contain info:
- what is it?
- how to start it? including prerequisites
- how to run tests?
- how to run lint?
- whatever you find reasonable to share with other coders or whoever

package.json dependencies section contains not strict versions. it will lead to pain. new versions could be incompatible with each other or just be buggy.

added some inline comment. those starting with FYI just for information, not to fix

# overall

- good comments
- easy to comprehend code
- good file structure
- good descriptive variable names

# views

## good

- goof usage of classes - easy to read

## improve

- JSDOC. it's simple one. [intro](https://jsdoc.app/about-getting-started.html) and [cheatsheet](https://devhints.io/jsdoc).  would reduce time for code understanding. also would be easy to code - VS Code intellisense would make proper suggestions.
- semantic html. make life of blind people easy. and make intentions of markup element clear for developers and robots. it's almost none efforts
- translation
- no inline css
- commented out code is misleading. better delete it
