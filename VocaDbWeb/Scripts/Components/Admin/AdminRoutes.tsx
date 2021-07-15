import React from 'react';
import { Route, Routes } from 'react-router-dom';

const AdminIndex = React.lazy(() => import('./AdminIndex'));

const AdminRoutes = (): React.ReactElement => {
	return (
		<Routes>
			<Route path="/" element={<AdminIndex />} />
		</Routes>
	);
};

export default AdminRoutes;
