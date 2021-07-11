import Alert from '@Bootstrap/Alert';
import React from 'react';

import NotificationIcon from './NotificationIcon';

interface NotificationPanelProps {
	message: string;
	messageId: string;
}

const NotificationPanel = React.memo(
	({ message, messageId }: NotificationPanelProps): React.ReactElement => {
		return (
			<Alert>
				<NotificationIcon />
				<span id={messageId}>{message}</span>
			</Alert>
		);
	},
);

export default NotificationPanel;
