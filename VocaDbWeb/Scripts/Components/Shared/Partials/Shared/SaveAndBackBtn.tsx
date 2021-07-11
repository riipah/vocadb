import Button from '@Bootstrap/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SaveAndBackBtnProps {
	backAction: string;
}

const SaveAndBackBtn = React.memo(
	({ backAction }: SaveAndBackBtnProps): React.ReactElement => {
		const { t } = useTranslation('HelperRes');

		return (
			<p>
				<Button type="submit" variant="primary" /* TODO: submitting */>
					<i className="icon-ok icon-white"></i> &nbsp;
					{t('HelperRes:Helper.SaveChanges')}
				</Button>{' '}
				<Button className="btn-nomargin" href={backAction}>
					<i className="icon-backward"></i> &nbsp;
					{t('HelperRes:Helper.ReturnWithoutSaving')}
				</Button>
			</p>
		);
	},
);

export default SaveAndBackBtn;
