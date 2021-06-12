// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/8a7e095e8032fdeac4fd1fdb41e6dfb452ae4494/src/Dropdown.tsx
import useEventCallback from '@restart/hooks/useEventCallback';
import classNames from 'classnames';
import * as React from 'react';
import { useContext } from 'react';
import BaseDropdown from 'react-overlays/Dropdown';
import { useUncontrolled } from 'uncontrollable';

import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import SelectableContext from './SelectableContext';
import { useBootstrapPrefix } from './ThemeProvider';
import {
	BsPrefixProps,
	BsPrefixRefForwardingComponent,
	SelectCallback,
} from './helpers';

const DropdownHeader = ({
	as: Component = 'h6',
	children,
}: {
	as?: any;
	children?: React.ReactNode;
}): React.ReactElement => (
	<li>
		<Component>{children}</Component>
	</li>
);
const DropdownDivider = (): React.ReactElement => <li className="divider" />;
const DropdownItemText = ({
	as: Component = 'p',
	children,
}: {
	as?: any;
	children?: React.ReactNode;
}): React.ReactElement => (
	<li>
		<Component>{children}</Component>
	</li>
);

export interface DropdownProps
	extends BsPrefixProps,
		Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
	show?: boolean;
	onToggle?: (
		isOpen: boolean,
		event: React.SyntheticEvent,
		metadata: { source: 'select' | 'click' | 'rootClose' | 'keydown' },
	) => void;
	onSelect?: SelectCallback;
}

const Dropdown: BsPrefixRefForwardingComponent<
	'div',
	DropdownProps
> = React.forwardRef<HTMLElement, DropdownProps>((pProps, ref) => {
	const {
		bsPrefix,
		show,
		className,
		onSelect,
		onToggle,
		// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
		as: Component = 'div',
		...props
	} = useUncontrolled(pProps, { show: 'onToggle' });

	const onSelectCtx = useContext(SelectableContext);
	const prefix = useBootstrapPrefix(bsPrefix, 'dropdown');

	const handleToggle = useEventCallback(
		(nextShow, event, source = event.type) => {
			if (
				event.currentTarget === document &&
				(source !== 'keydown' || event.key === 'Escape')
			)
				source = 'rootClose';
			onToggle?.(nextShow, event, { source });
		},
	);

	const handleSelect = useEventCallback((key, event) => {
		onSelectCtx?.(key, event);
		onSelect?.(key, event);
		handleToggle(false, event, 'select');
	});

	return (
		<SelectableContext.Provider value={handleSelect}>
			<BaseDropdown
				show={show}
				onToggle={handleToggle}
				itemSelector={`.${prefix}-item:not(.disabled):not(:disabled)`}
			>
				<Component
					{...props}
					ref={ref}
					className={classNames(className, show && 'open', 'btn-group')}
				/>
			</BaseDropdown>
		</SelectableContext.Provider>
	);
});

export default Object.assign(Dropdown, {
	Toggle: DropdownToggle,
	Menu: DropdownMenu,
	Item: DropdownItem,
	ItemText: DropdownItemText,
	Divider: DropdownDivider,
	Header: DropdownHeader,
});
