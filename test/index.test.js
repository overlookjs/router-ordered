/* --------------------
 * @overlook/plugin-ordered module
 * Tests
 * ------------------*/

'use strict';

// Modules
const {Route} = require('@overlook/core'),
	pluginOrdered = require('../index'),
	{IDENTIFIER} = pluginOrdered;

// Init
require('./support');

// Tests

describe('Extension', () => { // eslint-disable-line jest/lowercase-name
	it('is a function', () => {
		expect(pluginOrdered).toBeFunction();
	});

	it('returns a subclass of input', () => {
		const RouteOrdered = pluginOrdered(Route);
		expect(RouteOrdered).toBeFunction();
		expect(Object.getPrototypeOf(RouteOrdered)).toBe(Route);
		expect(Object.getPrototypeOf(RouteOrdered.prototype)).toBe(Route.prototype);
	});

	describe('when passed to `Route.extend()`', () => {
		let RouteOrdered;
		beforeEach(() => {
			RouteOrdered = Route.extend(pluginOrdered);
		});

		it('returns subclass of Route', () => {
			expect(RouteOrdered).toBeFunction();
			expect(Object.getPrototypeOf(RouteOrdered)).toBe(Route);
			expect(Object.getPrototypeOf(RouteOrdered.prototype)).toBe(Route.prototype);
		});

		it('has identifier symbol', () => {
			expect(RouteOrdered[IDENTIFIER]).toBeTrue();
		});

		it('class instance has identifier symbol', () => {
			const route = new RouteOrdered();
			expect(route[IDENTIFIER]).toBeTrue();
		});
	});

	describe('exports symbols', () => {
		it.each([['IDENTIFIER'], ['IS_BEFORE'], ['ORDER'], ['SIBLINGS_BEFORE'], ['SIBLINGS_AFTER']])(
			'%s',
			(key) => {
				expect(typeof pluginOrdered[key]).toBe('symbol');
			}
		);
	});
});
