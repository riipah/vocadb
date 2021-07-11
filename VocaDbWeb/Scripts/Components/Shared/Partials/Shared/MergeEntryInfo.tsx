import Alert from '@Bootstrap/Alert';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MergeEntryInfo = React.memo(
	(): React.ReactElement => {
		const { t } = useTranslation(['ViewRes']);

		return (
			<>
				<Alert>
					<h4>{t('ViewRes:EntryMerge.MergeWarning')}</h4>
				</Alert>
				<Alert variant="info" className="pre-line">
					{t('ViewRes:EntryMerge.MergeInfo')}
				</Alert>
			</>
		);
	},
);

export default MergeEntryInfo;
