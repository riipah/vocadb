// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/3d4c57374646949e6fedfef00236c99f4d1b4e71/src/Navbar.tsx
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useUncontrolled } from 'uncontrollable';

import NavbarBrand from './NavbarBrand';
import NavbarCollapse from './NavbarCollapse';
import NavbarContext, { NavbarContextType } from './NavbarContext';
import NavbarToggle from './NavbarToggle';
import { useBootstrapPrefix } from './ThemeProvider';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface NavbarProps
	extends BsPrefixProps,
		Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
	expand?: boolean;
	fixed?: 'top' | 'bottom';
	onToggle?: (expanded: boolean) => void;
	expanded?: boolean;
}

const NavbarOuter: BsPrefixRefForwardingComponent<
	'nav',
	NavbarProps
> = React.forwardRef<HTMLElement, NavbarProps>((props, ref) => {
	const {
		bsPrefix: initialBsPrefix,
		expand,
		fixed,
		className,
		as: Component = 'nav',
		expanded,
		onToggle,
		...controlledProps
	} = useUncontrolled(props, {
		expanded: 'onToggle',
	});

	const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'navbar');

	// will result in some false positives but that seems better
	// than false negatives. strict `undefined` check allows explicit
	// "nulling" of the role if the user really doesn't want one
	if (controlledProps.role === undefined && Component !== 'nav') {
		controlledProps.role = 'navigation';
	}
	let expandClass = `${bsPrefix}-expand`;
	if (typeof expand === 'string') expandClass = `${expandClass}-${expand}`;

	const navbarContext = useMemo<NavbarContextType>(
		() => ({
			onToggle: (): void => onToggle?.(!expanded),
			bsPrefix,
			expanded: !!expanded,
		}),
		[bsPrefix, expanded, onToggle],
	);

	return (
		<NavbarContext.Provider value={navbarContext}>
			<Component
				ref={ref}
				{...controlledProps}
				className={classNames(
					className,
					bsPrefix,
					expand && expandClass,
					fixed && `navbar-fixed-${fixed}`,
				)}
			></Component>
		</NavbarContext.Provider>
	);
});

const Navbar = ({
	children,
	...props
}: NavbarProps & { children: React.ReactNode }): React.ReactElement => {
	return (
		<NavbarOuter {...props}>
			<div className="navbar-inner">{children}</div>
		</NavbarOuter>
	);
};

export default Object.assign(Navbar, {
	Brand: NavbarBrand,
	Toggle: NavbarToggle,
	Collapse: NavbarCollapse,
});
