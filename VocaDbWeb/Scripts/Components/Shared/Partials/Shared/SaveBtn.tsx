import Button from '@Bootstrap/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';

const SaveBtn = React.memo(
	(): React.ReactElement => {
		const { t } = useTranslation('HelperRes');

		return (
			<p>
				<Button type="submit" variant="primary">
					<i className="icon-ok icon-white"></i> &nbsp;
					{t('HelperRes:Helper.SaveChanges')}
				</Button>
			</p>
		);
	},
);

export default SaveBtn;
