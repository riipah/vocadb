import React from 'react';

const PatreonLink = (): React.ReactElement => {
	return (
		<>
			<p>
				<small>{vdb.values.paypalDonateTitle}</small>
			</p>

			<a href={vdb.values.patreonLink} target="_blank">
				<img
					src={'/Content/patreon.png'}
					alt="Support on Patreon"
					title="Support on Patreon"
				/>
			</a>
		</>
	);
};

export default PatreonLink;
