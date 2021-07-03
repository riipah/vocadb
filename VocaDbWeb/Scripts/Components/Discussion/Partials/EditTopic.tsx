import LoginManager from '@Models/LoginManager';
import DiscussionTopicEditStore from '@Stores/Discussion/DiscussionTopicEditStore';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

const loginManager = new LoginManager(vdb.values);

interface EditTopicProps {
	store: DiscussionTopicEditStore;
}

const EditTopic = observer(
	({ store }: EditTopicProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes.Discussion']);

		return (
			<>
				<label>{t('ViewRes.Discussion:Index.Topic')}</label>
				<input
					value={store.name}
					onChange={(e): void => store.setName(e.target.value)}
					type="text"
					className="input-xlarge"
					maxLength={200}
					required
				/>

				<div className="discussion-topic-edit-content">
					<div className="edit-text">
						<label>{t('ViewRes.Discussion:Index.PostContent')}</label>
						<textarea
							value={store.content}
							onChange={(e): void => store.setContent(e.target.value)}
							cols={60}
							rows={6}
							required
						/>
					</div>

					<div className="edit-preview">
						<label>{t('ViewRes.Discussion:Index.Preview')}</label>
						<div /* TODO */>{store.content}</div>
					</div>

					{loginManager.canDeleteComments && (
						<>
							<div /* TODO */>{/* TODO */}</div>
							<p>
								<label>
									<input type="checkbox" /* TODO */ /> Locked
									{/* TODO: localize */}
								</label>
							</p>
						</>
					)}
				</div>
			</>
		);
	},
);

export default EditTopic;
