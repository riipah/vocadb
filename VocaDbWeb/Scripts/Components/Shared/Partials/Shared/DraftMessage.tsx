import Alert from '@Bootstrap/Alert';
import React from 'react';
import { useTranslation } from 'react-i18next';

import NotificationIcon from './NotificationIcon';

interface DraftMessageProps {
	section: string;
}

const DraftMessage = React.memo(
	({ section }: DraftMessageProps): React.ReactElement => {
		const { t } = useTranslation(['HelperRes']);

		return (
			<Alert>
				<NotificationIcon />
				<span>{t('HelperRes:Helper.DraftMessage')}</span>
				<span>
					{t('HelperRes:Helper.SeeGuidePre')}{' '}
					<a href={`/Help?guidelines+${section}`}>
						{t('HelperRes:Helper.SeeGuide')}
					</a>{' '}
					{t('HelperRes:Helper.SeeGuidePost')}
				</span>
			</Alert>
		);
	},
);

export default DraftMessage;
