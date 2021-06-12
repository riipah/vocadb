// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/8a7e095e8032fdeac4fd1fdb41e6dfb452ae4494/src/Button.tsx
import classNames from 'classnames';
import * as React from 'react';

import SafeAnchor from './SafeAnchor';
import { useBootstrapPrefix } from './ThemeProvider';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from './helpers';
import { ButtonVariant } from './types';

export type ButtonType = 'button' | 'reset' | 'submit' | string;

export interface ButtonProps
	extends React.HTMLAttributes<HTMLElement>,
		BsPrefixProps {
	variant?: ButtonVariant;
	type?: ButtonType;
	href?: string;
	disabled?: boolean;
}

const Button: BsPrefixRefForwardingComponent<
	'button',
	ButtonProps
> = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ bsPrefix, variant, className, type, as, ...props }, ref) => {
		const prefix = useBootstrapPrefix(bsPrefix, 'btn');

		const classes = classNames(
			className,
			prefix,
			variant && `${prefix}-${variant}`,
		);

		if (props.href) {
			return (
				<SafeAnchor
					{...props}
					as={as}
					ref={ref}
					className={classNames(classes, props.disabled && 'disabled')}
				/>
			);
		}

		if (!type && !as) {
			type = 'button';
		}

		const Component = as || 'button';
		return <Component {...props} ref={ref} type={type} className={classes} />;
	},
);

export default Button;
