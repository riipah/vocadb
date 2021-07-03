import Breadcrumb from '@Bootstrap/Breadcrumb';
import DiscussionIndexStore from '@Stores/Discussion/DiscussionIndexStore';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { DiscussionLayout } from './Discussion';

interface DiscussionTopicProps {
	store: DiscussionIndexStore;
}

const DiscussionTopic = observer(
	({ store }: DiscussionTopicProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes.Discussion']);
		const { topicId } = useParams();

		React.useEffect(() => {
			store.selectTopicById(Number(topicId));
		}, [store, topicId]);

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
							to: `/discussion/folders/${store.selectedFolder?.id}`,
						}}
					>
						{store.selectedFolder?.name}
					</Breadcrumb.Item>
				</Breadcrumb>
			</DiscussionLayout>
		);
	},
);

export default DiscussionTopic;
