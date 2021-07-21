import Button from '@Bootstrap/Button';
import ServerSidePaging from '@Components/Shared/Partials/Knockout/ServerSidePaging';
import ProfileIconKnockout_ImageSize from '@Components/Shared/Partials/User/ProfileIconKnockout_ImageSize';
import ImageSize from '@Models/Images/ImageSize';
import LoginManager from '@Models/LoginManager';
import DiscussionIndexStore from '@Stores/Discussion/DiscussionIndexStore';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import EditTopic from './EditTopic';

const loginManager = new LoginManager(vdb.values);

interface ViewFolderProps {
	discussionIndexStore: DiscussionIndexStore;
}

const ViewFolder = observer(
	({ discussionIndexStore }: ViewFolderProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes.Discussion']);
		const navigate = useNavigate();

		return (
			<div /* TODO */ className="discussion-folder">
				<ul className="nav nav-pills folder-list">
					{discussionIndexStore.folders.map((folder) => (
						<li
							className={classNames(
								folder === discussionIndexStore.selectedFolder && 'active',
							)}
							key={folder.id}
						>
							<Link
								to={`/discussion/folders/${folder.id}`}
								title={folder.description}
							>
								{folder.name}
							</Link>
						</li>
					))}
				</ul>

				{discussionIndexStore.selectedFolder?.description && (
					<p className="folder-description">
						{discussionIndexStore.selectedFolder.description}
					</p>
				)}

				{loginManager.canCreateComments && (
					<>
						{discussionIndexStore.showCreateNewTopic ? (
							<form
								onSubmit={(e): void => {
									e.preventDefault();
									discussionIndexStore
										.createNewTopic()
										.then((topic) =>
											navigate(`/discussion/topics/${topic.id}`),
										);
								}}
								className="well well-transparent"
							>
								<EditTopic
									discussionTopicEditStore={discussionIndexStore.newTopic}
								/>
								<Button type="submit" variant="primary">
									{t('ViewRes.Discussion:Index.DoPost')}
								</Button>
							</form>
						) : (
							<Button
								onClick={(): void =>
									discussionIndexStore.setShowCreateNewTopic(true)
								}
								className="create-topic"
							>
								<i className="icon-comment"></i>{' '}
								{t('ViewRes.Discussion:Index.WriteNewPost')}
							</Button>
						)}
					</>
				)}

				<ServerSidePaging pagingStore={discussionIndexStore.paging} />

				<table className="table">
					<thead>
						<tr>
							<th>{t('ViewRes.Discussion:Index.Topic')}</th>
							<th>{t('ViewRes.Discussion:Index.Author')}</th>
							<th className="hidden-phone">
								{t('ViewRes.Discussion:Index.Comments')}
							</th>
							<th>{t('ViewRes.Discussion:Index.Created')}</th>
							<th>{t('ViewRes.Discussion:Index.LastComment')}</th>
						</tr>
					</thead>
					<tbody className="discussion-topics">
						{discussionIndexStore.topics.map((topic) => (
							<tr
								onClick={(): void => navigate(`/discussion/topics/${topic.id}`)}
								key={topic.id}
							>
								<td>
									<span>{topic.name}</span>
								</td>
								<td>
									<span>
										<ProfileIconKnockout_ImageSize
											imageSize={ImageSize.TinyThumb}
											user={topic.author}
											size={18}
										/>{' '}
										<span>{topic.author.name}</span>
									</span>
								</td>
								<td className="hidden-phone">
									<span>{topic.commentCount}</span>
								</td>
								<td>
									<span>{moment(topic.created).format('lll')}</span>
								</td>
								<td>
									{topic.lastComment && (
										<span>
											{moment(topic.lastComment.created).format('lll')} by{' '}
											{topic.lastComment.authorName}
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<ServerSidePaging pagingStore={discussionIndexStore.paging} />
			</div>
		);
	},
);

export default ViewFolder;
