// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/8a7e095e8032fdeac4fd1fdb41e6dfb452ae4494/src/createChainedFunction.tsx

/**
 * Safe chained function
 *
 * Will only create a new function if needed,
 * otherwise will pass back existing functions or null.
 *
 * @param {function} functions to chain
 * @returns {function|null}
 */
function createChainedFunction(...funcs: any[]): any {
	return funcs
		.filter((f) => f != null)
		.reduce((acc, f) => {
			if (typeof f !== 'function') {
				throw new Error(
					'Invalid Argument Type, must only provide functions, undefined, or null.',
				);
			}

			if (acc === null) return f;

			return function chainedFunction(...args: any[]): void {
				// @ts-ignore
				acc.apply(this, args);
				// @ts-ignore
				f.apply(this, args);
			};
		}, null);
}

export default createChainedFunction;
