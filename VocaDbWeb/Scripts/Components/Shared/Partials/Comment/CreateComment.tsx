import Button from '@Bootstrap/Button';
import EditableCommentsStore from '@Stores/EditableCommentsStore';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface CreateCommentProps {
	editableCommentsStore: EditableCommentsStore;
	className: string;
	newCommentRows: number;
}

const CreateComment = observer(
	({
		editableCommentsStore,
		className,
		newCommentRows,
	}: CreateCommentProps): React.ReactElement => {
		const { t } = useTranslation(['ViewRes']);

		return (
			<div className={classNames('create-comment', className)}>
				<form
					onSubmit={(e): void => {
						e.preventDefault();
						editableCommentsStore.createComment();
					}}
				>
					<textarea
						value={editableCommentsStore.newComment}
						onChange={(e): void =>
							editableCommentsStore.setNewComment(e.target.value)
						}
						rows={newCommentRows}
						cols={60}
						maxLength={2000}
						className="comment-text-edit"
						placeholder={t('ViewRes:DiscussionContent.NewComment')}
						required
					/>
					<Button type="submit" variant="primary">
						{t('ViewRes:DiscussionContent.AddComment')}
					</Button>
				</form>
			</div>
		);
	},
);

export default CreateComment;
