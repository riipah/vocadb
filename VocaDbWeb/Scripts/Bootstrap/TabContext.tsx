// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/c11bc67ab3105e7a1839c0dcaacc5f1099885f02/src/TabContext.tsx
import * as React from 'react';

export interface TabContextType {
	onSelect: any;
	activeKey: any;
	transition: any;
	mountOnEnter: boolean;
	unmountOnExit: boolean;
	getControlledId: (key: any) => any;
	getControllerId: (key: any) => any;
}

const TabContext = React.createContext<TabContextType | null>(null);

export default TabContext;
