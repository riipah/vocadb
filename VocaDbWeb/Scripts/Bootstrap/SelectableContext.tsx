// Code from: https://github.com/react-bootstrap/react-bootstrap/blob/8a7e095e8032fdeac4fd1fdb41e6dfb452ae4494/src/SelectableContext.tsx
import * as React from 'react';

import { SelectCallback } from './helpers';

const SelectableContext = React.createContext<SelectCallback | null>(null);

export const makeEventKey = (
	eventKey?: string | number | null,
	href: string | null = null,
): string | null => {
	if (eventKey != null) return String(eventKey);
	return href || null;
};

export default SelectableContext;
