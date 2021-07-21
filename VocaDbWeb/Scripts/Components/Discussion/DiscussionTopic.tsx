import Breadcrumb from '@Bootstrap/Breadcrumb';
import DiscussionIndexStore from '@Stores/Discussion/DiscussionIndexStore';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { DiscussionLayout } from './DiscussionRoutes';
import ViewTopic from './Partials/ViewTopic';

interface DiscussionTopicProps {
	discussionIndexStore: DiscussionIndexStore;
}

const DiscussionTopic = observer(
	({ discussionIndexStore }: DiscussionTopicProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes.Discussion']);
		const { topicId } = useParams();

		React.useEffect(() => {
			discussionIndexStore.selectTopicById(Number(topicId));
		}, [discussionIndexStore, topicId]);

		return (
			<DiscussionLayout>
				<Breadcrumb>
					<Breadcrumb.Item
						linkAs={Link}
						linkProps={{ to: '/discussion' }}
						divider
					>
						{t('ViewRes.Discussion:Index.Discussions')}
					</Breadcrumb.Item>
					<Breadcrumb.Item
						linkAs={Link}
						linkProps={{
							to: `/discussion/folders/${discussionIndexStore.selectedFolder?.id}`,
						}}
					>
						{discussionIndexStore.selectedFolder?.name}
					</Breadcrumb.Item>
				</Breadcrumb>

				{discussionIndexStore.selectedTopic && (
					<ViewTopic
						discussionIndexStore={discussionIndexStore}
						discussionTopicStore={discussionIndexStore.selectedTopic}
					/>
				)}
			</DiscussionLayout>
		);
	},
);

export default DiscussionTopic;
