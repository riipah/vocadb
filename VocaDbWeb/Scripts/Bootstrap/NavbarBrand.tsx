// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/3d4c57374646949e6fedfef00236c99f4d1b4e71/src/NavbarBrand.tsx
import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as React from 'react';

import { useBootstrapPrefix } from './ThemeProvider';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface NavbarBrandProps
	extends BsPrefixProps,
		React.HTMLAttributes<HTMLElement> {
	href?: string;
}

const propTypes = {
	/** @default 'navbar' */
	bsPrefix: PropTypes.string,

	/**
	 * An href, when provided the Brand will render as an `<a>` element (unless `as` is provided).
	 */
	href: PropTypes.string,

	/**
	 * Set a custom element for this component.
	 */
	as: PropTypes.elementType,
};

const NavbarBrand: BsPrefixRefForwardingComponent<
	'a',
	NavbarBrandProps
> = React.forwardRef<HTMLElement, NavbarBrandProps>(
	({ bsPrefix, className, as, ...props }, ref) => {
		bsPrefix = useBootstrapPrefix(bsPrefix, 'brand hidden-phone');

		const Component = as || (props.href ? 'a' : 'span');

		return (
			<div className={classNames(bsPrefix)}>
				<Component {...props} ref={ref} className={classNames(className)} />
			</div>
		);
	},
);

NavbarBrand.displayName = 'NavbarBrand';
NavbarBrand.propTypes = propTypes;

export default NavbarBrand;
