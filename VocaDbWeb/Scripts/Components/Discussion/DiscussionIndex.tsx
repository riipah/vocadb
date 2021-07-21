import DiscussionIndexStore from '@Stores/Discussion/DiscussionIndexStore';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { DiscussionLayout } from './DiscussionRoutes';
import ViewFolders from './Partials/ViewFolders';

interface DiscussionIndexProps {
	discussionIndexStore: DiscussionIndexStore;
}

const DiscussionIndex = observer(
	({ discussionIndexStore }: DiscussionIndexProps): React.ReactElement => {
		React.useEffect(() => {
			discussionIndexStore.setSelectedFolder(undefined);
			discussionIndexStore.setSelectedTopic(undefined);
		}, [discussionIndexStore]);

		return (
			<DiscussionLayout>
				<ViewFolders discussionIndexStore={discussionIndexStore} />
			</DiscussionLayout>
		);
	},
);

export default DiscussionIndex;
