/* --------------------
 * @overlook/plugin-ordered module
 * Tests
 * Test function to ensure all exports present
 * ------------------*/

/* eslint-disable jest/no-export */

'use strict';

// Exports

module.exports = function itExports(orderedPlugin) {
	describe('symbols', () => {
		it.each([
			'IS_BEFORE'
		])('%s', (key) => {
			expect(typeof orderedPlugin[key]).toBe('symbol');
		});
	});
};
