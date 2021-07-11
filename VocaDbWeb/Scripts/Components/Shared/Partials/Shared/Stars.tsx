import _ from 'lodash';
import React from 'react';

interface StarsProps {
	current: number;
	max: number;
}

const Stars = React.memo(
	({ current, max }: StarsProps): React.ReactElement => {
		return (
			<>
				{_.range(1, max + 1).map((i) => (
					<React.Fragment key={i}>
						{current >= i ? (
							<img src="/Content/star.png" alt="*" />
						) : (
							<img src="/Content/star_disabled.png" alt="" />
						)}{' '}
					</React.Fragment>
				))}
			</>
		);
	},
);

export default Stars;
