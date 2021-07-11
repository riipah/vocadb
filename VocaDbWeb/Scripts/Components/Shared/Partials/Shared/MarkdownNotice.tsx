import React from 'react';
import { useTranslation } from 'react-i18next';

const MarkdownNotice = React.memo(
	(): React.ReactElement => {
		const { t } = useTranslation(['HelperRes']);

		return (
			<small>
				(
				<a
					href="https://help.github.com/articles/github-flavored-markdown"
					target="_blank"
				>
					{t('HelperRes:Helper.GitHubMarkdown')}
				</a>{' '}
				{t('HelperRes:Helper.IsSupportedForFormatting')})
			</small>
		);
	},
);

export default MarkdownNotice;
