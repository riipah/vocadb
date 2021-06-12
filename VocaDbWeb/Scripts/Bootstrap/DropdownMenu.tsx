// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/8a7e095e8032fdeac4fd1fdb41e6dfb452ae4494/src/DropdownMenu.tsx
import classNames from 'classnames';
import * as React from 'react';
import { useDropdownMenu } from 'react-overlays/DropdownMenu';

import { useBootstrapPrefix } from './ThemeProvider';
import {
	BsPrefixProps,
	BsPrefixRefForwardingComponent,
	SelectCallback,
} from './helpers';

export interface DropdownMenuProps
	extends BsPrefixProps,
		Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
	show?: boolean;
	onSelect?: SelectCallback;
	rootCloseEvent?: 'click' | 'mousedown';
}

const DropdownMenu: BsPrefixRefForwardingComponent<
	'ul',
	DropdownMenuProps
> = React.forwardRef<HTMLElement, DropdownMenuProps>(
	(
		{
			bsPrefix,
			className,
			rootCloseEvent,
			show: showProps,
			// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
			as: Component = 'ul',
			...props
		},
		ref,
	) => {
		const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-menu');

		const [menuProps, { show }] = useDropdownMenu({
			rootCloseEvent,
			show: showProps,
		});

		return (
			<Component
				{...props}
				{...menuProps}
				// Bootstrap css requires this data attrib to style responsive menus.
				className={classNames(className, prefix, show && 'show')}
			/>
		);
	},
);

export default DropdownMenu;
