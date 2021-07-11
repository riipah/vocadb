import OptionalGeoPointContract from '@DataContracts/OptionalGeoPointContract';
import React from 'react';

interface EmbedGoogleMapsProps {
	coordinates: OptionalGeoPointContract;
}

const EmbedGoogleMaps = React.memo(
	({ coordinates }: EmbedGoogleMapsProps): React.ReactElement => {
		return (
			<div>
				<iframe
					src={`https://maps.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&output=embed`}
					frameBorder={0}
					scrolling="no"
					marginHeight={0}
					marginWidth={0}
					width={600}
					height={450}
				/>
			</div>
		);
	},
);

export default EmbedGoogleMaps;
