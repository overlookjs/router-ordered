/* --------------------
 * @overlook/plugin-ordered module
 * Tests
 * ESM export
 * ------------------*/

// Modules
import Plugin from '@overlook/plugin';
import orderedPlugin, * as namedExports from '@overlook/plugin-ordered/es';

// Imports
import itExports from './exports.js';

// Tests

describe('ESM export', () => {
	it('default export is an instance of Plugin class', () => {
		expect(orderedPlugin).toBeInstanceOf(Plugin);
	});

	describe('default export has properties', () => {
		itExports(orderedPlugin);
	});

	describe('named exports', () => {
		itExports(namedExports);
	});
});
