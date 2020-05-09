/* --------------------
 * @overlook/plugin-ordered module
 * ESM entry point
 * Re-export CJS with named exports
 * ------------------*/

// Exports

import orderedPlugin from '../lib/index.js';

export default orderedPlugin;
export const {
	IS_BEFORE
} = orderedPlugin;
