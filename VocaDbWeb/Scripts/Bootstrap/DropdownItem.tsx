// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/8a7e095e8032fdeac4fd1fdb41e6dfb452ae4494/src/DropdownItem.tsx
import useEventCallback from '@restart/hooks/useEventCallback';
import classNames from 'classnames';
import * as React from 'react';
import { useContext } from 'react';

import SafeAnchor from './SafeAnchor';
import SelectableContext, { makeEventKey } from './SelectableContext';
import { useBootstrapPrefix } from './ThemeProvider';
import {
	BsPrefixProps,
	BsPrefixRefForwardingComponent,
	SelectCallback,
} from './helpers';
import { EventKey } from './types';

export interface DropdownItemProps
	extends BsPrefixProps,
		Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
	disabled?: boolean;
	eventKey?: EventKey;
	href?: string;
	onSelect?: SelectCallback;
}

const DropdownItem: BsPrefixRefForwardingComponent<
	typeof SafeAnchor,
	DropdownItemProps
> = React.forwardRef(
	(
		{
			bsPrefix,
			className,
			eventKey,
			disabled,
			href,
			onClick,
			onSelect,
			as: Component = SafeAnchor,
			...props
		}: DropdownItemProps,
		ref,
	) => {
		const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-item');
		const onSelectCtx = useContext(SelectableContext);

		const key = makeEventKey(eventKey, href);

		const handleClick = useEventCallback((event) => {
			// SafeAnchor handles the disabled case, but we handle it here
			// for other components
			if (disabled) return;
			onClick?.(event);
			onSelectCtx?.(key, event);
			onSelect?.(key, event);
		});

		return (
			<li>
				<Component
					{...props}
					ref={ref}
					href={href}
					disabled={disabled}
					className={classNames(className, prefix, disabled && 'disabled')}
					onClick={handleClick}
				/>
			</li>
		);
	},
);

export default DropdownItem;
