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

e.g. For path-matching routes, `/photos/new` needs to be before `/photos/:id` so `new` gets a chance to be matched first.

## Usage

### Where to use it

This plugin should be on the routes which need to be ordered, not the parent containing them. i.e. on `/photos/new` and `/photos/:id`, not `/photos`.

Then use [@overlook/plugin-order](https://www.npmjs.com/package/@overlook/plugin-order) on the parent route to order its children.

### Defining order

Each route can say that it needs to be before or after any other of its siblings.

It can do this by extending the `[IS_BEFORE]()` method.

`[IS_BEFORE]()` will be called with each of the route's siblings. It can return:

* `true` if route needs to be before that sibling
* `false` if route needs to be after that sibling
* `undefined` if no preference

The default `[IS_BEFORE]()` method provided by this plugin returns `undefined` (i.e. no preference).

```js
const Route = require('@overlook/route');
const orderPlugin = require('@overlook/plugin-order');
const orderedPlugin = require('@overlook/plugin-ordered');
const {IS_BEFORE} = orderedPlugin;

const OrderRoute = Route.extend( orderPlugin );
const OrderedRoute = Route.extend( orderedPlugin );

class ChildRoute extends OrderedRoute {
  [IS_BEFORE]( sibling ) {
    // If super method returns a result, use it
    const isBefore = super[IS_BEFORE]( sibling );
    if ( isBefore != null ) return before;

    // Sort in alphabetical order
    if ( this.name === sibling.name ) return undefined;
    return this.name < sibling.name ? true : false;
  }
}

const root = new OrderRoute();
root.attachChild( new ChildRoute( { name: 'def' } ) );
root.attachChild( new ChildRoute( { name: 'abc' } ) );

await root.init();
// Children are now re-ordered, with 'abc' first
```

## Versioning

This module follows [semver](https://semver.org/). Breaking changes will only be made in major version updates.

All active NodeJS release lines are supported (v10+ at time of writing). After a release line of NodeJS reaches end of life according to [Node's LTS schedule](https://nodejs.org/en/about/releases/), support for that version of Node may be dropped at any time, and this will not be considered a breaking change. Dropping support for a Node version will be made in a minor version update (e.g. 1.2.0 to 1.3.0). If you are using a Node version which is approaching end of life, pin your dependency of this module to patch updates only using tilde (`~`) e.g. `~1.2.3` to avoid breakages.

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
