import React from 'react';

const NotificationIcon = React.memo(
	(): React.ReactElement => {
		return (
			<span
				className="ui-icon ui-icon-info"
				style={{ float: 'left', marginRight: '.3em' }}
			></span>
		);
	},
);

export default NotificationIcon;
