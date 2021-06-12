// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/c11bc67ab3105e7a1839c0dcaacc5f1099885f02/src/NavbarToggle.tsx
import useEventCallback from '@restart/hooks/useEventCallback';
import classNames from 'classnames';
import React, { useContext } from 'react';

import NavbarContext from './NavbarContext';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface NavbarToggleProps
	extends BsPrefixProps,
		React.HTMLAttributes<HTMLElement> {
	label?: string;
}

const NavbarToggle: BsPrefixRefForwardingComponent<
	'button',
	NavbarToggleProps
> = React.forwardRef<HTMLElement, NavbarToggleProps>(
	(
		{
			bsPrefix,
			className,
			children,
			label,
			as: Component = 'a',
			onClick,
			...props
		},
		ref,
	) => {
		const { onToggle, expanded } = useContext(NavbarContext) || {};

		const handleClick = useEventCallback((e) => {
			if (onClick) onClick(e);
			if (onToggle) onToggle();
		});

		return (
			<Component
				{...props}
				ref={ref}
				onClick={handleClick}
				aria-label={label}
				className={classNames(
					'btn',
					'btn-navbar',
					className,
					bsPrefix,
					!expanded && 'collapsed',
				)}
			>
				{children || (
					<>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</>
				)}
			</Component>
		);
	},
);

export default NavbarToggle;
