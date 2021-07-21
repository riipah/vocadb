import Breadcrumb from '@Bootstrap/Breadcrumb';
import DiscussionIndexStore from '@Stores/Discussion/DiscussionIndexStore';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { DiscussionLayout } from './DiscussionRoutes';
import ViewFolder from './Partials/ViewFolder';

interface DiscussionFolderProps {
	discussionIndexStore: DiscussionIndexStore;
}

const DiscussionFolder = observer(
	({ discussionIndexStore }: DiscussionFolderProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes.Discussion']);
		const { folderId } = useParams();

		React.useEffect(() => {
			discussionIndexStore.selectFolderById(Number(folderId));
		}, [discussionIndexStore, folderId]);

		return (
			<DiscussionLayout>
				<Breadcrumb>
					<Breadcrumb.Item linkAs={Link} linkProps={{ to: '/discussion' }}>
						{t('ViewRes.Discussion:Index.Discussions')}
					</Breadcrumb.Item>
				</Breadcrumb>

				<ViewFolder discussionIndexStore={discussionIndexStore} />
			</DiscussionLayout>
		);
	},
);

export default DiscussionFolder;
