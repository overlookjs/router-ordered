/* --------------------
 * @overlook/plugin-ordered module
 * Tests
 * ------------------*/

'use strict';

// Modules
const Overlook = require('@overlook/core'),
	{Route} = Overlook,
	pluginOrdered = require('@overlook/plugin-ordered'),
	{IS_BEFORE} = pluginOrdered;

// Tests

const RouteOrdered = Route.extend(pluginOrdered);

let app, parent, child1, child2;
beforeEach(() => {
	app = new Overlook();
	parent = new Route();
	child1 = new RouteOrdered();
	child2 = new RouteOrdered();
	parent.attachChild(child1);
	parent.attachChild(child2);
	app.attachRouter(parent);
});

describe('Ordering', () => { // eslint-disable-line jest/lowercase-name
	it('`.init()` does nothing if is root route', () => {
		app = new Overlook();
		parent = new RouteOrdered();
		app.attachRouter(parent);
		app.init();
		expect(app.router).toBe(parent);
	});

	describe('`.init()` orders children according to `[IS_BEFORE]()`', () => {
		describe('with 2 routes', () => {
			it('in order attached by default', () => {
				app.init();
				expect(parent.children[0]).toBe(child1);
				expect(parent.children[1]).toBe(child2);
			});

			it('in default order if `[IS_BEFORE]()` returns null', () => {
				child1[IS_BEFORE] = () => null;
				child2[IS_BEFORE] = () => null;
				app.init();
				expect(parent.children[0]).toBe(child1);
				expect(parent.children[1]).toBe(child2);
			});

			it('if 1st child indicates it is first', () => {
				child1[IS_BEFORE] = () => true;
				app.init();
				expect(parent.children[0]).toBe(child1);
				expect(parent.children[1]).toBe(child2);
			});

			it('if 1st child indicates it is last', () => {
				child1[IS_BEFORE] = () => false;
				app.init();
				expect(parent.children[0]).toBe(child2);
				expect(parent.children[1]).toBe(child1);
			});

			it('if 2nd child indicates it is first', () => {
				child2[IS_BEFORE] = () => true;
				app.init();
				expect(parent.children[0]).toBe(child2);
				expect(parent.children[1]).toBe(child1);
			});

			it('if 2nd child indicates it is last', () => {
				child2[IS_BEFORE] = () => false;
				app.init();
				expect(parent.children[0]).toBe(child1);
				expect(parent.children[1]).toBe(child2);
			});

			it('if both indicate 1st child is first', () => {
				child1[IS_BEFORE] = () => true;
				child2[IS_BEFORE] = () => false;
				app.init();
				expect(parent.children[0]).toBe(child1);
				expect(parent.children[1]).toBe(child2);
			});

			it('if both indicate 1st child is last', () => {
				child1[IS_BEFORE] = () => false;
				child2[IS_BEFORE] = () => true;
				app.init();
				expect(parent.children[0]).toBe(child2);
				expect(parent.children[1]).toBe(child1);
			});
		});

		describe('with 4 routes', () => {
			let child3, child4;
			beforeEach(() => {
				child3 = new RouteOrdered();
				child4 = new RouteOrdered();
				parent.attachChild(child3);
				parent.attachChild(child4);
			});

			it('in order attached by default', () => {
				app.init();
				expect(parent.children[0]).toBe(child1);
				expect(parent.children[1]).toBe(child2);
				expect(parent.children[2]).toBe(child3);
				expect(parent.children[3]).toBe(child4);
			});

			it('in default order if `[IS_BEFORE]()` returns null', () => {
				child1[IS_BEFORE] = () => null;
				child2[IS_BEFORE] = () => null;
				child3[IS_BEFORE] = () => null;
				child4[IS_BEFORE] = () => null;
				app.init();
				expect(parent.children[0]).toBe(child1);
				expect(parent.children[1]).toBe(child2);
				expect(parent.children[2]).toBe(child3);
				expect(parent.children[3]).toBe(child4);
			});

			describe('moves child to latest possible', () => {
				it('when new child declares it is before a sibling', () => {
					child4[IS_BEFORE] = sibling => (sibling === child3 ? true : null);
					app.init();
					expect(parent.children[0]).toBe(child1);
					expect(parent.children[1]).toBe(child2);
					expect(parent.children[2]).toBe(child4);
					expect(parent.children[3]).toBe(child3);
				});

				it('when sibling declares it is after new child', () => {
					child3[IS_BEFORE] = sibling => (sibling === child4 ? false : null);
					app.init();
					expect(parent.children[0]).toBe(child1);
					expect(parent.children[1]).toBe(child2);
					expect(parent.children[2]).toBe(child4);
					expect(parent.children[3]).toBe(child3);
				});

				it('when new child declares it is after a sibling', () => {
					child4[IS_BEFORE] = sibling => (sibling === child1 ? false : null);
					app.init();
					expect(parent.children[0]).toBe(child1);
					expect(parent.children[1]).toBe(child2);
					expect(parent.children[2]).toBe(child3);
					expect(parent.children[3]).toBe(child4);
				});

				it('when sibling declares it is before new child', () => {
					child1[IS_BEFORE] = sibling => (sibling === child4 ? true : null);
					app.init();
					expect(parent.children[0]).toBe(child1);
					expect(parent.children[1]).toBe(child2);
					expect(parent.children[2]).toBe(child3);
					expect(parent.children[3]).toBe(child4);
				});

				it('when new child declares it is after one sibling and before another', () => {
					child4[IS_BEFORE] = sibling => (sibling === child1 ? false : null);
					child4[IS_BEFORE] = sibling => (sibling === child3 ? true : null);
					app.init();
					expect(parent.children[0]).toBe(child1);
					expect(parent.children[1]).toBe(child2);
					expect(parent.children[2]).toBe(child4);
					expect(parent.children[3]).toBe(child3);
				});

				it('when one sibling declares it is before new child and another sibling declares it is after', () => {
					child1[IS_BEFORE] = sibling => (sibling === child4 ? true : null);
					child3[IS_BEFORE] = sibling => (sibling === child4 ? false : null);
					app.init();
					expect(parent.children[0]).toBe(child1);
					expect(parent.children[1]).toBe(child2);
					expect(parent.children[2]).toBe(child4);
					expect(parent.children[3]).toBe(child3);
				});
			});
		});
	});

	describe('`.init()` throws error if conflict', () => {
		it('direct conflict', () => {
			child1[IS_BEFORE] = () => true;
			child2[IS_BEFORE] = () => true;

			expect(() => {
				app.init();
			}).toThrowWithMessage(Error, 'Route ordering conflict (router path /?)');
		});

		it('circular conflict', () => {
			const child3 = new RouteOrdered();
			const child4 = new RouteOrdered();
			parent.attachChild(child3);
			parent.attachChild(child4);

			child1[IS_BEFORE] = sibling => (sibling === child2 ? true : null);
			child2[IS_BEFORE] = sibling => (sibling === child3 ? true : null);
			child3[IS_BEFORE] = sibling => (sibling === child4 ? true : null);
			child4[IS_BEFORE] = sibling => (sibling === child1 ? true : null);

			expect(() => {
				app.init();
			}).toThrowWithMessage(Error, 'Route ordering conflict (router path /?)');
		});
	});
});
