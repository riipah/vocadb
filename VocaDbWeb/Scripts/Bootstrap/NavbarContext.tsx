// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/c11bc67ab3105e7a1839c0dcaacc5f1099885f02/src/NavbarContext.tsx
import * as React from 'react';

// TODO: check
export interface NavbarContextType {
	onToggle: () => void;
	bsPrefix?: string;
	expanded: boolean;
}

const context = React.createContext<NavbarContextType | null>(null);
context.displayName = 'NavbarContext';

export default context;
