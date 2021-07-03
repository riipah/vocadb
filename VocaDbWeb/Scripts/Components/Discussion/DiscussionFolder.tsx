import Breadcrumb from '@Bootstrap/Breadcrumb';
import Button from '@Bootstrap/Button';
import Nav from '@Bootstrap/Nav';
import ServerSidePaging from '@Components/Shared/Partials/Knockout/ServerSidePaging';
import ProfileIconKnockout_ImageSize from '@Components/Shared/Partials/User/ProfileIconKnockout_ImageSize';
import ImageSize from '@Models/Images/ImageSize';
import DiscussionIndexStore from '@Stores/Discussion/DiscussionIndexStore';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { DiscussionLayout } from './Discussion';
import EditTopic from './Partials/EditTopic';

interface DiscussionFolderProps {
	store: DiscussionIndexStore;
}

const DiscussionFolder = observer(
	({ store }: DiscussionFolderProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes.Discussion']);
		const navigate = useNavigate();
		const { folderId } = useParams();

		React.useEffect(() => {
			store.selectFolderById(Number(folderId));
		}, [store, folderId]);

		return (
			<DiscussionLayout>
				<Breadcrumb>
					<Breadcrumb.Item linkAs={Link} linkProps={{ to: '/discussion' }}>
						{t('ViewRes.Discussion:Index.Discussions')}
					</Breadcrumb.Item>
				</Breadcrumb>

				<div className="discussion-folder">
					<Nav variant="pills" className="folder-list">
						{store.folders.map((folder) => (
							<Nav.Item
								className={classNames(
									folder === store.selectedFolder && 'active',
								)}
								key={folder.id}
							>
								<Link
									to={`/discussion/folders/${folder.id}`}
									title={folder.description}
								>
									{folder.name}
								</Link>
							</Nav.Item>
						))}
					</Nav>
				</div>

				{store.selectedFolder?.description && (
					<p className="folder-description">
						{store.selectedFolder?.description}
					</p>
				)}

				{store.loginManager.canCreateComments && (
					<>
						{store.showCreateNewTopic ? (
							<form /* TODO */ className="well well-transparent">
								<div>
									<EditTopic store={store.newTopic} />
								</div>
								<Button type="submit" variant="primary">
									{t('ViewRes.Discussion:Index.DoPost')}
								</Button>
							</form>
						) : (
							<Button
								onClick={(): void => {
									store.setShowCreateNewTopic(true);
								}}
								className="create-topic"
							>
								<i className="icon-comment"></i>{' '}
								{t('ViewRes.Discussion:Index.WriteNewPost')}
							</Button>
						)}
					</>
				)}

				<ServerSidePaging paging={store.paging} />

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
						{store.topics.map((topic) => (
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

				<ServerSidePaging paging={store.paging} />
			</DiscussionLayout>
		);
	},
);

export default DiscussionFolder;
