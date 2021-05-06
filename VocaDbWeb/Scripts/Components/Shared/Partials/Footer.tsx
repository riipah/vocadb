import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = (): React.ReactElement => {
	const { t } = useTranslation(['ViewRes']);

	return (
		<span className="about-disclaimer">
			<a href="https://piapro.jp/t/nire">
				{t('ViewRes:Layout.BackgroundCredit', { 0: 'みゆ' })}
			</a>
			{' | '}
			<a href="https://github.com/VocaDB/vocadb/">
				{t('ViewRes:Layout.OtherCredit')}
			</a>
			{' | '}
			<a href="https://wiki.vocadb.net/wiki/29/license">
				{t('ViewRes:Layout.License')}
			</a>
			{' | '}
			<a href="https://wiki.vocadb.net/wiki/50/privacy-and-cookie-policy">
				{t('ViewRes:Layout.PrivacyPolicy')}
			</a>
		</span>
	);
};

export default Footer;
