/* --------------------
 * @overlook/plugin-ordered module
 * Tests
 * CJS export
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	orderedPlugin = require('@overlook/plugin-ordered');

// Imports
const itExports = require('./exports.js');

// Tests

describe('CJS export', () => { // eslint-disable-line jest/lowercase-name
	it('is an instance of Plugin class', () => {
		expect(orderedPlugin).toBeInstanceOf(Plugin);
	});

	describe('has properties', () => {
		itExports(orderedPlugin);
	});
});
