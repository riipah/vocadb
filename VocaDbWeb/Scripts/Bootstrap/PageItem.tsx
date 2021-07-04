// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/3d4c57374646949e6fedfef00236c99f4d1b4e71/src/PageItem.tsx

/* eslint-disable react/no-multi-comp */
import classNames from 'classnames';
import * as React from 'react';
import { ReactNode } from 'react';

import SafeAnchor from './SafeAnchor';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';

export interface PageItemProps
	extends React.HTMLAttributes<HTMLElement>,
		BsPrefixProps {
	disabled?: boolean;
	active?: boolean;
	activeLabel?: string;
	href?: string;
}

const PageItem: BsPrefixRefForwardingComponent<
	'li',
	PageItemProps
> = React.forwardRef<HTMLLIElement, PageItemProps>(
	(
		{
			active,
			disabled,
			className,
			style,
			activeLabel,
			children,
			...props
		}: PageItemProps,
		ref,
	) => {
		const Component = active || disabled ? 'span' : SafeAnchor;
		return (
			<li
				ref={ref}
				style={style}
				className={classNames(className, 'page-item', { active, disabled })}
			>
				<Component className="page-link" disabled={disabled} {...props}>
					{children}
					{active && activeLabel && (
						<span className="visually-hidden">{activeLabel}</span>
					)}
				</Component>
			</li>
		);
	},
);

PageItem.displayName = 'PageItem';

export default PageItem;

function createButton(
	name: string,
	defaultValue: ReactNode,
	label = name,
): ({ children, ...props }: PageItemProps) => React.ReactElement {
	function Button({ children, ...props }: PageItemProps): React.ReactElement {
		return (
			<PageItem {...props}>
				<span aria-hidden="true">{children || defaultValue}</span>
			</PageItem>
		);
	}

	Button.displayName = name;

	return Button;
}

export const First = createButton('First', '«');
export const Prev = createButton('Prev', '‹', 'Previous');
export const Ellipsis = createButton('Ellipsis', '…', 'More');
export const Next = createButton('Next', '›');
export const Last = createButton('Last', '»');
