import DiscussionIndexStore from '@Stores/Discussion/DiscussionIndexStore';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface ViewFoldersProps {
	discussionIndexStore: DiscussionIndexStore;
}

const ViewFolders = observer(
	({ discussionIndexStore }: ViewFoldersProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes.Discussion']);
		const navigate = useNavigate();

		return (
			<div /* TODO */ className="row-fluid">
				<div className="span8">
					<table className="table">
						<thead>
							<tr>
								<th>{t('ViewRes.Discussion:Index.Folder')}</th>
								<th>{t('ViewRes.Discussion:Index.Topics')}</th>
								<th>{t('ViewRes.Discussion:Index.LastTopic')}</th>
							</tr>
						</thead>
						<tbody className="discussion-folders">
							{discussionIndexStore.folders.map((folder) => (
								<tr
									onClick={(): void =>
										navigate(`/discussion/folders/${folder.id}`)
									}
									key={folder.id}
								>
									<td>
										<span className="discussion-folder-name">
											{folder.name}
										</span>
										<span className="discussion-folder-description">
											{folder.description}
										</span>
									</td>
									<td>
										<span>{folder.topicCount}</span>
									</td>
									<td>
										{folder.lastTopicDate && (
											<span>
												{moment(folder.lastTopicDate).format('lll')} by{' '}
												{folder.lastTopicAuthor?.name}
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{discussionIndexStore.recentTopics.length > 0 && (
					<div className="span4">
						<h4>{t('ViewRes.Discussion:Index.RecentTopics')}</h4>
						<table className="table">
							<tbody className="discussion-folders">
								{discussionIndexStore.recentTopics.map((recentTopic) => (
									<tr
										onClick={(): void =>
											navigate(`/discussion/topics/${recentTopic.id}`)
										}
										key={recentTopic.id}
									>
										<td>
											{recentTopic.name}
											<br />
											<span className="extraInfo">
												{moment(recentTopic.created).format('lll')} by{' '}
												{recentTopic.author.name}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		);
	},
);

export default ViewFolders;
