// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/8a7e095e8032fdeac4fd1fdb41e6dfb452ae4494/src/DropdownToggle.tsx
import classNames from 'classnames';
import * as React from 'react';
import { useDropdownToggle } from 'react-overlays/DropdownToggle';

import Button, { ButtonProps } from './Button';
import { useBootstrapPrefix } from './ThemeProvider';
import { BsPrefixRefForwardingComponent } from './helpers';

export interface DropdownToggleProps extends ButtonProps {}

type DropdownToggleComponent = BsPrefixRefForwardingComponent<
	'button',
	DropdownToggleProps
>;

const DropdownToggle: DropdownToggleComponent = React.forwardRef(
	(
		{
			bsPrefix,
			className,
			// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
			as: Component = Button,
			...props
		}: DropdownToggleProps,
		ref,
	) => {
		const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-toggle');

		const [toggleProps] = useDropdownToggle();

		// This intentionally forwards size and variant (if set) to the
		// underlying component, to allow it to render size and style variants.
		return (
			<Component
				className={classNames(className, prefix)}
				{...toggleProps}
				{...props}
			/>
		);
	},
);

export default DropdownToggle;
