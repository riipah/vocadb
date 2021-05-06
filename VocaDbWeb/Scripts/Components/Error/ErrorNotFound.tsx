import Layout from '@Components/Shared/Layout';
import React from 'react';

const ErrorNotFound = (): React.ReactElement => {
	return (
		<Layout
			title="404 - Not found"
			subtitle="Sorry, the page/resource you were looking for was not found"
		>
			<iframe
				width="560"
				height="315"
				src="https://www.youtube.com/embed/z4D6bwsU6CA"
				frameBorder="0"
				/*wmode="Opaque"*/
				allowFullScreen
			></iframe>
			<br />
			<br />

			<p>
				<a href={'/Song/Details/18486'}>Video entry</a>
			</p>
		</Layout>
	);
};

export default ErrorNotFound;
