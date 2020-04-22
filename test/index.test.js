/* --------------------
 * @overlook/plugin-ordered module
 * Tests
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	pluginOrdered = require('@overlook/plugin-ordered');

// Tests

describe('Extension', () => { // eslint-disable-line jest/lowercase-name
	it('is an object', () => {
		expect(pluginOrdered).toBeObject();
	});

	it('when passed to `Route.extend()`, returns subclass of Route', () => {
		const RouteOrdered = Route.extend(pluginOrdered);
		expect(RouteOrdered).toBeFunction();
		expect(Object.getPrototypeOf(RouteOrdered)).toBe(Route);
		expect(Object.getPrototypeOf(RouteOrdered.prototype)).toBe(Route.prototype);
	});

	describe('exports symbols', () => {
		it.each([['IS_BEFORE'], ['ORDER'], ['SIBLINGS_BEFORE'], ['SIBLINGS_AFTER']])(
			'%s',
			(key) => {
				expect(typeof pluginOrdered[key]).toBe('symbol');
			}
		);
	});
});
