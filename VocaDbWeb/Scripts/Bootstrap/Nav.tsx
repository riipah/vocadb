// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/d278c495ffe987420947c036baedc6ec34ed7e8b/src/Nav.tsx
import classNames from 'classnames';
import * as React from 'react';
import { useContext } from 'react';
import { useUncontrolled } from 'uncontrollable';

import AbstractNav from './AbstractNav';
import NavItem from './NavItem';
import NavLink from './NavLink';
import NavbarContext from './NavbarContext';
import { useBootstrapPrefix } from './ThemeProvider';
import {
	BsPrefixProps,
	BsPrefixRefForwardingComponent,
	SelectCallback,
} from './helpers';
import { EventKey } from './types';

export interface NavProps
	extends BsPrefixProps,
		Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
	navbarBsPrefix?: string;
	cardHeaderBsPrefix?: string;
	variant?: 'tabs' | 'pills';
	activeKey?: EventKey;
	defaultActiveKey?: EventKey;
	fill?: boolean;
	justify?: boolean;
	onSelect?: SelectCallback;
	navbar?: boolean;
	navbarScroll?: boolean;
}

const Nav: BsPrefixRefForwardingComponent<'ul', NavProps> = React.forwardRef<
	HTMLElement,
	NavProps
>((uncontrolledProps, ref) => {
	const {
		as = 'ul',
		bsPrefix: initialBsPrefix,
		variant,
		fill,
		justify,
		navbar,
		navbarScroll,
		className,
		activeKey,
		...props
	} = useUncontrolled(uncontrolledProps, { activeKey: 'onSelect' });

	const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'nav');

	let navbarBsPrefix;
	let cardHeaderBsPrefix;
	let isNavbar = false;

	const navbarContext = useContext(NavbarContext);

	if (navbarContext) {
		navbarBsPrefix = navbarContext.bsPrefix;
		isNavbar = navbar == null ? true : navbar;
	}

	return (
		<AbstractNav
			as={as}
			ref={ref}
			activeKey={activeKey}
			className={classNames(className, {
				[bsPrefix]: !isNavbar,
				[`${navbarBsPrefix}-nav`]: isNavbar,
				[`${navbarBsPrefix}-nav-scroll`]: isNavbar && navbarScroll,
				[`${cardHeaderBsPrefix}-${variant}`]: !!cardHeaderBsPrefix,
				[`${bsPrefix}-${variant}`]: !!variant,
				[`${bsPrefix}-fill`]: fill,
				[`${bsPrefix}-justified`]: justify,
			})}
			{...props}
		/>
	);
});

Nav.displayName = 'Nav';

export default Object.assign(Nav, {
	Item: NavItem,
	Link: NavLink,
});
