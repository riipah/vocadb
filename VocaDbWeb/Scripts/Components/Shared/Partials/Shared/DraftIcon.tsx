import EntryStatus from '@Models/EntryStatus';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface DraftIconProps {
	status: EntryStatus;
}

const DraftIcon = React.memo(
	({ status }: DraftIconProps): React.ReactElement => {
		const { t } = useTranslation(['HelperRes']);

		return (
			<>
				{status === EntryStatus.Draft && (
					<img
						src="/Content/draft.png"
						title={t('HelperRes:Helper.DraftIconTitle')}
						alt="draft"
					/>
				)}
			</>
		);
	},
);

export default DraftIcon;
