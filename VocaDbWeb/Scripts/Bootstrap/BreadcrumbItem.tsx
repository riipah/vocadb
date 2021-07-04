// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/c11bc67ab3105e7a1839c0dcaacc5f1099885f02/src/BreadcrumbItem.tsx
import classNames from 'classnames';
import * as React from 'react';

import SafeAnchor from './SafeAnchor';
import { useBootstrapPrefix } from './ThemeProvider';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface BreadcrumbItemProps
	extends BsPrefixProps,
		Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
	active?: boolean;
	href?: string;
	linkAs?: React.ElementType;
	target?: string;
	title?: React.ReactNode;
	linkProps?: Record<string, any>; // the generic is to much work here
	divider?: boolean;
}

const BreadcrumbItem: BsPrefixRefForwardingComponent<
	'li',
	BreadcrumbItemProps
> = React.forwardRef<HTMLElement, BreadcrumbItemProps>(
	(
		{
			bsPrefix,
			active,
			children,
			className,
			// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
			as: Component = 'li',
			linkAs: LinkComponent = SafeAnchor,
			linkProps,
			href,
			title,
			target,
			divider,
			...props
		},
		ref,
	) => {
		const prefix = useBootstrapPrefix(bsPrefix, 'breadcrumb-item');

		return (
			<Component
				ref={ref}
				{...props}
				className={classNames(prefix, className, { active })}
				aria-current={active ? 'page' : undefined}
			>
				{active ? (
					children
				) : (
					<LinkComponent
						{...linkProps}
						href={href}
						title={title}
						target={target}
					>
						{children}
					</LinkComponent>
				)}
				{divider && <span className="divider">/</span>}
			</Component>
		);
	},
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

export default BreadcrumbItem;
