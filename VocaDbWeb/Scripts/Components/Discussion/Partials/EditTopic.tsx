import Markdown from '@Components/KnockoutExtensions/Markdown';
import LoginManager from '@Models/LoginManager';
import DiscussionTopicEditStore from '@Stores/Discussion/DiscussionTopicEditStore';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

const loginManager = new LoginManager(vdb.values);

interface EditTopicProps {
	discussionTopicEditStore: DiscussionTopicEditStore;
}

const EditTopic = observer(
	({ discussionTopicEditStore }: EditTopicProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes.Discussion']);

		return (
			<div>
				<label>{t('ViewRes.Discussion:Index.Topic')}</label>
				<input
					value={discussionTopicEditStore.name}
					onChange={(e): void =>
						discussionTopicEditStore.setName(e.target.value)
					}
					type="text"
					className="input-xlarge"
					maxLength={200}
					required
				/>

				<div className="discussion-topic-edit-content">
					<div className="edit-text">
						<label>{t('ViewRes.Discussion:Index.PostContent')}</label>
						<textarea
							value={discussionTopicEditStore.content}
							onChange={(e): void =>
								discussionTopicEditStore.setContent(e.target.value)
							}
							cols={60}
							rows={6}
							required
						/>
					</div>

					<div className="edit-preview">
						<label>{t('ViewRes.Discussion:Index.Preview')}</label>
						<div>
							<Markdown>{discussionTopicEditStore.content}</Markdown>
						</div>
					</div>

					{loginManager.canDeleteComments && (
						<>
							{discussionTopicEditStore.folders.length > 0 && (
								<div>
									<label>Folder{/* TODO: localize */}</label>
									<select
										value={discussionTopicEditStore.folderId}
										onChange={(e): void =>
											discussionTopicEditStore.setFolderId(
												Number(e.target.value),
											)
										}
									>
										{discussionTopicEditStore.folders.map((folder) => (
											<option value={folder.id} key={folder.id}>
												{folder.name}
											</option>
										))}
									</select>
								</div>
							)}
							<p>
								<label>
									<input
										type="checkbox"
										checked={discussionTopicEditStore.locked}
										onChange={(e): void =>
											discussionTopicEditStore.setLocked(e.target.checked)
										}
									/>{' '}
									Locked{/* TODO: localize */}
								</label>
							</p>
						</>
					)}
				</div>
			</div>
		);
	},
);

export default EditTopic;
