import CommentContract from '@DataContracts/CommentContract';

import RepositoryParams from './RepositoryParams';

// Repository for managing comments
export default interface ICommentRepository {
	createComment({
		baseUrl,
		entryId,
		contract,
	}: RepositoryParams & {
		entryId: number;
		contract: CommentContract;
	}): Promise<CommentContract>;

	deleteComment({
		baseUrl,
		commentId,
	}: RepositoryParams & { commentId: number }): Promise<void>;

	getComments({
		baseUrl,
		entryId,
	}: RepositoryParams & { entryId: number }): Promise<CommentContract[]>;

	updateComment({
		baseUrl,
		commentId,
		contract,
	}: RepositoryParams & {
		commentId: number;
		contract: CommentContract;
	}): Promise<void>;
}
