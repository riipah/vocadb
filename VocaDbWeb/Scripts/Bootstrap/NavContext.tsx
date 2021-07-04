// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/62609973722e5769b968eb62913b4f5708df00fc/src/NavContext.tsx
import * as React from 'react';

import { EventKey } from './types';

interface NavContextType {
	role?: string; // used by NavLink to determine it's role
	activeKey: EventKey | null;
	getControlledId: (key: EventKey | null) => string;
	getControllerId: (key: EventKey | null) => string;
}

const NavContext = React.createContext<NavContextType | null>(null);
NavContext.displayName = 'NavContext';

export default NavContext;
