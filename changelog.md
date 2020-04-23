# Changelog

## 0.4.1

Changes:

* Rename class returned from plugin

Dependencies:

* Update `@overlook/plugin` dependency
* Update `@overlook/route` dependency

## 0.4.0

Breaking changes:

* Rename module `@overlook/plugin-ordered`
* Convert to plugin
* Drop support for Node v8

Refactor:

* Fully specify require file paths

No code:

* File header comments

Tests:

* Improve conflict tests
* Run tests in dev mode
* Import from package name [refactor]
* Remove unhandled rejection handling

Dev:

* Update dev dependencies
* Replace `.npmignore` with `files` list in `package.json`
* Remove unnecessary line from `.gitignore`
* Run tests on CI on Node v13 + v14
* `.editorconfig` config
* ESLint lint dot files
* ESLint ignore coverage dir
* Simplify Jest config
* Remove `sudo` from Travis CI config

Docs:

* Versioning policy
* Update license year

## 0.3.1

Bug fixes:

* Update debug instrumentation for latest `@overlook/core`
* Do not define sibling sets in `.initProps`

Tests:

* Remove `jest-each` dependency [refactor]

Docs:

* Document all functionality

## 0.3.0

Breaking changes:

* Create errors with `.debugError`

## 0.2.3

Docs:

* Fix missing changelog entry

## 0.2.2

Dev:

* Update `@overlook/core` dev dependency

## 0.2.1

Docs:

* Readme update

## 0.2.0

Breaking changes:

* Route extension identifier located at `.IDENTIFIER`

## 0.1.1

Bug fixes:

* `.init` not throw error if is root route

## 0.1.0

* Initial release
