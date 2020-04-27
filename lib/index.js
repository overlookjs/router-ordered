/* --------------------
 * @overlook/plugin-ordered module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	{INIT_PROPS, INIT_ROUTE} = require('@overlook/route');

// Imports
const pkg = require('../package.json');

// Exports

const orderedPlugin = new Plugin(
	pkg,
	{
		symbols: ['IS_BEFORE', 'ORDER', 'SIBLINGS_BEFORE', 'SIBLINGS_AFTER']
	},
	extend
);

module.exports = orderedPlugin;

const {IS_BEFORE, ORDER, SIBLINGS_BEFORE, SIBLINGS_AFTER} = orderedPlugin;

// Exports

function extend(Route) {
	return class OrderedRoute extends Route {
		[INIT_PROPS](props) {
			super[INIT_PROPS](props);

			// Init siblings sets
			this[SIBLINGS_BEFORE] = undefined; // Siblings which are before this one
			this[SIBLINGS_AFTER] = undefined; // Siblings which are after this one
		}

		[INIT_ROUTE]() {
			super[INIT_ROUTE]();
			this[ORDER]();
		}

		/**
		 * Re-order this route and its siblings based on result of `[IS_BEFORE]()`.
		 * Is called after `this.init()` and therefore siblings may or may not be initialized yet.
		 */
		[ORDER]() {
			// Exit if this is root
			const {parent} = this;
			if (!parent) return;

			// Get order relative to siblings
			const siblings = parent.children;
			for (const sibling of siblings) {
				if (sibling === this) continue;

				// Get order relative to sibling
				const isBefore = this[IS_BEFORE](sibling);
				if (isBefore === null) continue;

				// Set ordering
				if (isBefore) {
					setBefore(this, sibling);
				} else {
					setBefore(sibling, this);
				}
			}

			// Re-order children to correct order
			siblings.sort(sorter);
		}

		[IS_BEFORE]() { // eslint-disable-line class-methods-use-this
			// Default is null (i.e. no preference).
			// Expected to be extended by subclasses.
			return null;
		}
	};
}

// Helper functions

/**
 * Set route1 as before route2.
 * @param {Route} route1 - Route that is before route2
 * @param {Route} route2 - Route that is after route1
 * @returns {undefined}
 */
function setBefore(route1, route2) {
	// Init sibling sets on both routes
	for (const route of [route1, route2]) {
		if (route[SIBLINGS_BEFORE]) continue;
		route[SIBLINGS_BEFORE] = new Set();
		route[SIBLINGS_AFTER] = new Set();
	}

	// If this relationship already recorded, exit
	if (route1[SIBLINGS_AFTER].has(route2)) return;

	// Throw error if conflict with existing rule
	if (route1[SIBLINGS_BEFORE].has(route2)) throw new Error('Route ordering conflict');

	// Set before/after on these 2 routes
	route1[SIBLINGS_AFTER].add(route2);
	route2[SIBLINGS_BEFORE].add(route1);

	// Record all routes which are after route2 as being also after route1
	for (const route of route2[SIBLINGS_AFTER]) {
		setBefore(route1, route);
	}

	// Record all routes which are before route1 as being also before route2
	for (const route of route1[SIBLINGS_BEFORE]) {
		setBefore(route, route2);
	}
}

/**
 * Sorting children function.
 * @param {Route} route1 - 1st route
 * @param {Route} route2 - 2nd route
 * @returns {number} - `-1` if route1 comes first, `1` if route2 comes first, `0` if no preference
 */
function sorter(route1, route2) {
	if (!route1[SIBLINGS_BEFORE]) return 0;
	if (route1[SIBLINGS_AFTER].has(route2)) return -1;
	if (route1[SIBLINGS_BEFORE].has(route2)) return 1;
	return 0;
}
