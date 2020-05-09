/* --------------------
 * @overlook/plugin-ordered module
 * Tests
 * ------------------*/

'use strict';

// Modules
const Plugin = require('@overlook/plugin'),
	Route = require('@overlook/route'),
	orderedPlugin = require('@overlook/plugin-ordered'),
	{IS_BEFORE} = orderedPlugin;

// Tests

const OrderedRoute = Route.extend(orderedPlugin);

describe('Plugin', () => { // eslint-disable-line jest/lowercase-name
	it('is an instance of Plugin class', () => {
		expect(orderedPlugin).toBeInstanceOf(Plugin);
	});

	it('when passed to `Route.extend()`, returns subclass of Route', () => {
		expect(OrderedRoute).toBeFunction();
		expect(Object.getPrototypeOf(OrderedRoute)).toBe(Route);
		expect(Object.getPrototypeOf(OrderedRoute.prototype)).toBe(Route.prototype);
	});
});

describe('[IS_BEFORE]', () => {
	it('returns undefined', () => {
		const route = new OrderedRoute();
		expect(route[IS_BEFORE]()).toBeUndefined();
	});
});
