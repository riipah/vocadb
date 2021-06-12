// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/8a7e095e8032fdeac4fd1fdb41e6dfb452ae4494/src/ThemeProvider.tsx
import PropTypes from 'prop-types';
import * as React from 'react';
import { useContext, useMemo } from 'react';

export interface ThemeProviderProps {
	prefixes: Record<string, unknown>;
}

const ThemeContext = React.createContext<any>({});
const { Consumer, Provider } = ThemeContext;

function ThemeProvider({ prefixes, children }: any): React.ReactElement {
	const copiedPrefixes = useMemo(() => ({ ...prefixes }), [prefixes]);

	return <Provider value={copiedPrefixes}>{children}</Provider>;
}

ThemeProvider.propTypes = {
	prefixes: PropTypes.object.isRequired,
};

export function useBootstrapPrefix(
	prefix: string | undefined,
	defaultPrefix: string,
): string {
	const prefixes = useContext(ThemeContext);
	return prefix || prefixes[defaultPrefix] || defaultPrefix;
}

function createBootstrapComponent(Component: any, opts: any): React.ReactNode {
	if (typeof opts === 'string') opts = { prefix: opts };
	const isClassy = Component.prototype && Component.prototype.isReactComponent;
	// If it's a functional component make sure we don't break it with a ref
	const { prefix, forwardRefAs = isClassy ? 'ref' : 'innerRef' } = opts;

	const Wrapped = React.forwardRef(({ ...props }: any, ref) => {
		props[forwardRefAs] = ref;
		const bsPrefix = useBootstrapPrefix((props as any).bsPrefix, prefix);
		return <Component {...props} bsPrefix={bsPrefix} />;
	});

	Wrapped.displayName = `Bootstrap(${Component.displayName || Component.name})`;
	return Wrapped;
}

export { createBootstrapComponent, Consumer as ThemeConsumer };
export default ThemeProvider;
