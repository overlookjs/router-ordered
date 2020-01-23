[![NPM version](https://img.shields.io/npm/v/@overlook/plugin-ordered.svg)](https://www.npmjs.com/package/@overlook/plugin-ordered)
[![Build Status](https://img.shields.io/travis/overlookjs/plugin-ordered/master.svg)](http://travis-ci.org/overlookjs/plugin-ordered)
[![Dependency Status](https://img.shields.io/david/overlookjs/plugin-ordered.svg)](https://david-dm.org/overlookjs/plugin-ordered)
[![Dev dependency Status](https://img.shields.io/david/dev/overlookjs/plugin-ordered.svg)](https://david-dm.org/overlookjs/plugin-ordered)
[![Greenkeeper badge](https://badges.greenkeeper.io/overlookjs/plugin-ordered.svg)](https://greenkeeper.io/)
[![Coverage Status](https://img.shields.io/coveralls/overlookjs/plugin-ordered/master.svg)](https://coveralls.io/r/overlookjs/plugin-ordered)

# Overlook framework ordered plugin

Part of the [Overlook framework](https://overlookjs.github.io/).

## Abstract

Plugin for routes which need to be in a certain order relative to their siblings in their mutual parent's array of children.

e.g. For path-matching routes, `/photos/new` needs to be before `/photos/:id` so it gets a chance to be matched first.

## Usage

### Where to use it

This plugin should be on the routes which need to be ordered, not the parent containing them. i.e. on `/photos/new` and `/photos/:id`, not `/photos`.

### Defining order

Each route can say that it needs to be before or after any other of its siblings.

It can do this by extending the `[IS_BEFORE]()` method.

`[IS_BEFORE]()` will be called with each of the route's siblings. It can return:

* `true` if needs to be before that sibling
* `false` if needs to be after that sibling
* `null` if no preference

The default `[IS_BEFORE]()` method provided by the plugin returns `null` (i.e. no preference).

```js
const Route = require('@overlook/route');
const orderedPlugin = require('@overlook/plugin-ordered');
const {IS_BEFORE} = orderedPlugin;
const OrderedRoute = Route.extend( orderedPlugin );

class MyOrderedRoute extends OrderedRoute {
  [IS_BEFORE](sibling) {
    // If super method returns a result, use it
    const before = super[IS_BEFORE](sibling);
    if (before !== null) return before;

    // Sort in alphabetical order
    if (this.name === sibling.name) return null;
    return this.name < sibling.name ? true : false;
  }
}
```

### Conflicts

Ordering occurs in the `init` phase.

Every sibling will be asked where it wants to be relative to every other sibling.

Conflicts can occur if A says it's before B and B says it's before A, or there's a circular relationship (A before B, B before C, C before A).

In these cases an error will be thrown.

### Extending

The plugin also exposes an `[ORDER]()` method.

If you want to take some action before/after ordering, extend this method.

NB After `[ORDER]()`, *this* route will be in correct order as per its preferences, but all its siblings are not neccesarily in their final order. It's possible a later sibling may switch positions with another sibling once it's `[ORDER]()` method has been called.

## Tests

Use `npm test` to run the tests. Use `npm run cover` to check coverage.

## Changelog

See [changelog.md](https://github.com/overlookjs/plugin-ordered/blob/master/changelog.md)

## Issues

If you discover a bug, please raise an issue on Github. https://github.com/overlookjs/plugin-ordered/issues

## Contribution

Pull requests are very welcome. Please:

* ensure all tests pass before submitting PR
* add tests for new features
* document new functionality/API additions in README
* do not add an entry to Changelog (Changelog is created when cutting releases)
