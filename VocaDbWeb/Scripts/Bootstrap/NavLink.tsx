// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/3d4c57374646949e6fedfef00236c99f4d1b4e71/src/NavLink.tsx
import classNames from 'classnames';
import * as React from 'react';

import AbstractNavItem, { AbstractNavItemProps } from './AbstractNavItem';
import { useBootstrapPrefix } from './ThemeProvider';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface NavLinkProps
	extends BsPrefixProps,
		Omit<AbstractNavItemProps, 'as'> {}

const NavLink: BsPrefixRefForwardingComponent<
	'a',
	NavLinkProps
> = React.forwardRef<HTMLElement, NavLinkProps>(
	({ bsPrefix, disabled, className, as, ...props }, ref) => {
		bsPrefix = useBootstrapPrefix(bsPrefix, 'nav-link');
		return (
			<AbstractNavItem
				{...props}
				ref={ref}
				as={as as any}
				disabled={disabled}
				className={classNames(className, bsPrefix, disabled && 'disabled')}
			/>
		);
	},
);

NavLink.displayName = 'NavLink';

export default NavLink;
