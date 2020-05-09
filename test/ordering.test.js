/* --------------------
 * @overlook/plugin-ordered module
 * Tests
 * ------------------*/

'use strict';

// Modules
const Route = require('@overlook/route'),
	pluginOrdered = require('@overlook/plugin-ordered'),
	{IS_BEFORE} = pluginOrdered;

// Tests

const RouteOrdered = Route.extend(pluginOrdered);

let root, child1, child2;
beforeEach(() => {
	root = new Route({name: 'root'});
	child1 = new RouteOrdered({name: 'child1'});
	child2 = new RouteOrdered({name: 'child2'});
	root.attachChild(child1);
	root.attachChild(child2);
});

describe('Ordering', () => { // eslint-disable-line jest/lowercase-name
	it('`.init()` does nothing if is root route', async () => { // eslint-disable-line jest/expect-expect
		root = new RouteOrdered();
		await root.init();
		// Expect not to throw error
	});

	describe('`.init()` orders children according to `[IS_BEFORE]()`', () => {
		describe('with 2 routes', () => {
			it('in order attached by default', async () => {
				await root.init();
				expect(root.children[0]).toBe(child1);
				expect(root.children[1]).toBe(child2);
			});

			it('in default order if `[IS_BEFORE]()` returns null', async () => {
				child1[IS_BEFORE] = () => null;
				child2[IS_BEFORE] = () => null;
				await root.init();
				expect(root.children[0]).toBe(child1);
				expect(root.children[1]).toBe(child2);
			});

			it('if 1st child indicates it is first', async () => {
				child1[IS_BEFORE] = () => true;
				await root.init();
				expect(root.children[0]).toBe(child1);
				expect(root.children[1]).toBe(child2);
			});

			it('if 1st child indicates it is last', async () => {
				child1[IS_BEFORE] = () => false;
				await root.init();
				expect(root.children[0]).toBe(child2);
				expect(root.children[1]).toBe(child1);
			});

			it('if 2nd child indicates it is first', async () => {
				child2[IS_BEFORE] = () => true;
				await root.init();
				expect(root.children[0]).toBe(child2);
				expect(root.children[1]).toBe(child1);
			});

			it('if 2nd child indicates it is last', async () => {
				child2[IS_BEFORE] = () => false;
				await root.init();
				expect(root.children[0]).toBe(child1);
				expect(root.children[1]).toBe(child2);
			});

			it('if both indicate 1st child is first', async () => {
				child1[IS_BEFORE] = () => true;
				child2[IS_BEFORE] = () => false;
				await root.init();
				expect(root.children[0]).toBe(child1);
				expect(root.children[1]).toBe(child2);
			});

			it('if both indicate 1st child is last', async () => {
				child1[IS_BEFORE] = () => false;
				child2[IS_BEFORE] = () => true;
				await root.init();
				expect(root.children[0]).toBe(child2);
				expect(root.children[1]).toBe(child1);
			});
		});

		describe('with 4 routes', () => {
			let child3, child4;
			beforeEach(() => {
				child3 = new RouteOrdered();
				child4 = new RouteOrdered();
				root.attachChild(child3);
				root.attachChild(child4);
			});

			it('in order attached by default', async () => {
				await root.init();
				expect(root.children[0]).toBe(child1);
				expect(root.children[1]).toBe(child2);
				expect(root.children[2]).toBe(child3);
				expect(root.children[3]).toBe(child4);
			});

			it('in default order if `[IS_BEFORE]()` returns null', async () => {
				child1[IS_BEFORE] = () => null;
				child2[IS_BEFORE] = () => null;
				child3[IS_BEFORE] = () => null;
				child4[IS_BEFORE] = () => null;
				await root.init();
				expect(root.children[0]).toBe(child1);
				expect(root.children[1]).toBe(child2);
				expect(root.children[2]).toBe(child3);
				expect(root.children[3]).toBe(child4);
			});

			describe('moves child to latest possible', () => {
				it('when new child declares it is before a sibling', async () => {
					child4[IS_BEFORE] = sibling => (sibling === child3 ? true : null);
					await root.init();
					expect(root.children[0]).toBe(child1);
					expect(root.children[1]).toBe(child2);
					expect(root.children[2]).toBe(child4);
					expect(root.children[3]).toBe(child3);
				});

				it('when sibling declares it is after new child', async () => {
					child3[IS_BEFORE] = sibling => (sibling === child4 ? false : null);
					await root.init();
					expect(root.children[0]).toBe(child1);
					expect(root.children[1]).toBe(child2);
					expect(root.children[2]).toBe(child4);
					expect(root.children[3]).toBe(child3);
				});

				it('when new child declares it is after a sibling', async () => {
					child4[IS_BEFORE] = sibling => (sibling === child1 ? false : null);
					await root.init();
					expect(root.children[0]).toBe(child1);
					expect(root.children[1]).toBe(child2);
					expect(root.children[2]).toBe(child3);
					expect(root.children[3]).toBe(child4);
				});

				it('when sibling declares it is before new child', async () => {
					child1[IS_BEFORE] = sibling => (sibling === child4 ? true : null);
					await root.init();
					expect(root.children[0]).toBe(child1);
					expect(root.children[1]).toBe(child2);
					expect(root.children[2]).toBe(child3);
					expect(root.children[3]).toBe(child4);
				});

				it('when new child declares it is after one sibling and before another', async () => {
					child4[IS_BEFORE] = sibling => (sibling === child1 ? false : null);
					child4[IS_BEFORE] = sibling => (sibling === child3 ? true : null);
					await root.init();
					expect(root.children[0]).toBe(child1);
					expect(root.children[1]).toBe(child2);
					expect(root.children[2]).toBe(child4);
					expect(root.children[3]).toBe(child3);
				});

				it('when one sibling declares it is before new child and another sibling declares it is after', async () => {
					child1[IS_BEFORE] = sibling => (sibling === child4 ? true : null);
					child3[IS_BEFORE] = sibling => (sibling === child4 ? false : null);
					await root.init();
					expect(root.children[0]).toBe(child1);
					expect(root.children[1]).toBe(child2);
					expect(root.children[2]).toBe(child4);
					expect(root.children[3]).toBe(child3);
				});
			});
		});
	});

	describe('`.init()` throws error if conflict', () => {
		it('direct conflict', async () => {
			child1[IS_BEFORE] = () => true;
			child2[IS_BEFORE] = () => true;

			await expect(root.init()).rejects.toThrow(
				new Error('Route ordering conflict (router path /child2)')
			);
		});

		it('circular conflict', async () => {
			const child3 = new RouteOrdered({name: 'child3'});
			const child4 = new RouteOrdered({name: 'child4'});
			root.attachChild(child3);
			root.attachChild(child4);

			child1[IS_BEFORE] = sibling => (sibling === child2 ? true : null);
			child2[IS_BEFORE] = sibling => (sibling === child3 ? true : null);
			child3[IS_BEFORE] = sibling => (sibling === child4 ? true : null);
			child4[IS_BEFORE] = sibling => (sibling === child1 ? true : null);

			await expect(root.init()).rejects.toThrow(
				new Error('Route ordering conflict (router path /child4)')
			);
		});
	});
});
