/* --------------------
 * @overlook/plugin-ordered module
 * Entry point
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin');

// Imports
const pkg = require('../package.json');

// Exports

module.exports = new Plugin(
	pkg,
	{symbols: ['IS_BEFORE']},
	(Route, {IS_BEFORE}) => class OrderedRoute extends Route {
		/**
		 * Determine if this route goes before or after a sibling.
		 * Will be called by `@overlook/plugin-order`.
		 * Should return:
		 *   - `true` if this route goes before its sibling
		 *   - `false` if this route goes after its sibling
		 *   - `undefined` if no preference
		 *
		 * Expected to be extended by subclasses.
		 *
		 * @param {Route} sibling - Sibling route to compare against
		 * @returns {boolean|null|undefined}
		 */
		[IS_BEFORE](sibling) { // eslint-disable-line class-methods-use-this, no-unused-vars
			// Default is undefined (i.e. no preference).
			return undefined;
		}
	}
);
