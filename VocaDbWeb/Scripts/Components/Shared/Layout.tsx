import React from 'react';

interface LayoutProps {
	children?: React.ReactNode;
	subtitle?: string;
	title?: string;
}

const Layout = ({
	children,
	subtitle,
	title,
}: LayoutProps): React.ReactElement => {
	return (
		<>
			{/* TODO */}

			{title && (
				<h1 className="page-title">
					{title}
					{subtitle && <small>&nbsp;{subtitle}</small>}
				</h1>
			)}

			{/* TODO */}

			{children}

			{/* TODO */}
		</>
	);
};

export default Layout;
