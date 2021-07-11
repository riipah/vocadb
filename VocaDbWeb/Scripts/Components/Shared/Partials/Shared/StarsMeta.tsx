import _ from 'lodash';
import React from 'react';

interface StarsMetaProps {
	current: number;
	max: number;
}

const StarsMeta = React.memo(
	({ current, max }: StarsMetaProps): React.ReactElement => {
		return (
			<>
				{_.range(1, max + 1).map((i) => (
					<React.Fragment key={i}>
						{current >= i ? (
							<img
								className="rating"
								src="/Content/star.png"
								alt={`${current}`}
							/>
						) : (
							<img
								className="rating"
								src="/Content/star_disabled.png"
								alt={`${current}`}
							/>
						)}{' '}
					</React.Fragment>
				))}
			</>
		);
	},
);

export default StarsMeta;
