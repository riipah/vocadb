import CommentStore from '@Stores/CommentStore';
import EditableCommentsStore from '@Stores/EditableCommentsStore';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';

import ServerSidePaging from '../Knockout/ServerSidePaging';
import CommentBodyEditableKnockout from './CommentBodyEditableKnockout';
import CommentKnockout from './CommentKnockout';
import CreateComment from './CreateComment';

interface EditableCommentsProps {
	editableCommentsStore: EditableCommentsStore;
	allowCreateComment: boolean;
	well?: boolean;
	comments: CommentStore[];
	newCommentRows?: number;
	commentBoxEnd?: boolean;
	pagination?: boolean;
}

const EditableComments = observer(
	({
		editableCommentsStore,
		allowCreateComment,
		well = true,
		comments,
		newCommentRows = 6,
		commentBoxEnd = false,
		pagination = true,
	}: EditableCommentsProps): React.ReactElement => {
		const className = well ? 'well well-transparent' : 'standalone';

		return (
			<>
				{allowCreateComment && !commentBoxEnd && (
					<CreateComment
						editableCommentsStore={editableCommentsStore}
						className={className}
						newCommentRows={newCommentRows}
					/>
				)}

				{pagination && editableCommentsStore.paging.hasMultiplePages && (
					<ServerSidePaging pagingStore={editableCommentsStore.paging} />
				)}

				<div>
					{comments.map((comment) => (
						<div
							className={classNames('editable-comment', className)}
							key={comment.id}
						>
							<CommentKnockout
								commentKnockoutStore={comment}
								message={comment.message}
								allowMarkdown={false}
								onDelete={(): void =>
									editableCommentsStore.deleteComment(comment)
								}
								onEdit={(): void =>
									editableCommentsStore.beginEditComment(comment)
								}
								standalone={!well}
							>
								<CommentBodyEditableKnockout
									editableCommentsStore={editableCommentsStore}
									commentStore={comment}
									message={comment.message}
								/>
							</CommentKnockout>
						</div>
					))}
				</div>

				{pagination && editableCommentsStore.paging.hasMultiplePages && (
					<ServerSidePaging pagingStore={editableCommentsStore.paging} />
				)}

				{allowCreateComment && commentBoxEnd && (
					<CreateComment
						editableCommentsStore={editableCommentsStore}
						className={className}
						newCommentRows={newCommentRows}
					/>
				)}
			</>
		);
	},
);

export default EditableComments;
