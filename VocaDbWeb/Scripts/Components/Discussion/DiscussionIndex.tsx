import DiscussionIndexStore from '@Stores/Discussion/DiscussionIndexStore';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DiscussionLayout } from './Discussion';

interface DiscussionIndexProps {
	store: DiscussionIndexStore;
}

const DiscussionIndex = observer(
	({ store }: DiscussionIndexProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes.Discussion']);
		const navigate = useNavigate();

		React.useEffect(() => {
			store.setSelectedFolder(undefined);
			store.setSelectedTopic(undefined);
		}, [store]);

		return (
			<DiscussionLayout>
				<div className="row-fluid">
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
								{store.folders.map((folder) => (
									<tr
										onClick={(): void => navigate(`folders/${folder.id}`)}
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
										<td>{folder.topicCount}</td>
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

					<div className="span4">
						{store.recentTopics.length > 0 && (
							<>
								<h4>{t('ViewRes.Discussion:Index.RecentTopics')}</h4>
								<table className="table">
									<tbody className="discussion-folders">
										{store.recentTopics.map((recentTopic) => (
											<tr
												onClick={(): void =>
													navigate(`topics/${recentTopic.id}`)
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
							</>
						)}
					</div>
				</div>
			</DiscussionLayout>
		);
	},
);

export default DiscussionIndex;
