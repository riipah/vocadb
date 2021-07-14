import CommentContract from '@DataContracts/CommentContract';
import LoginManager from '@Models/LoginManager';
import ICommentRepository from '@Repositories/ICommentRepository';
import _ from 'lodash';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import CommentStore from './CommentStore';
import ServerSidePagingStore from './ServerSidePagingStore';

// Store for a list of comments where comments can be edited and new comments posted (with sufficient permissions).
export default class EditableCommentsStore {
	@observable public comments: CommentStore[] = [];

	// Whether all comments have been loaded
	@observable public commentsLoaded = false;

	@observable public editCommentStore?: CommentStore = undefined;

	@observable public newComment = '';
	@action public setNewComment = (value: string): void => {
		this.newComment = value;
	};

	public readonly paging = new ServerSidePagingStore();

	public constructor(
		private readonly loginManager: LoginManager,
		private readonly commentRepo: ICommentRepository,
		private readonly entryId: number,
		private readonly canDeleteAllComments: boolean,
		private readonly canEditAllComments: boolean,
		private readonly ascending: boolean,
		commentContracts?: CommentContract[],
		hasMoreComments: boolean = false,
	) {
		makeObservable(this);

		this.commentsLoaded = !!commentContracts && !hasMoreComments;

		if (commentContracts) {
			this.setComments(commentContracts);
		}
	}

	@computed public get pageOfComments(): CommentStore[] {
		return this.comments.slice(
			this.paging.firstItem,
			this.paging.firstItem + this.paging.pageSize,
		);
	}

	// Latest N comments
	@computed public get topComments(): CommentStore[] {
		return _.take(this.comments, 3);
	}

	@action public beginEditComment = (comment: CommentStore): void => {
		comment.beginEdit();
		this.editCommentStore = comment;
	};

	@action public cancelEditComment = (): void => {
		this.editCommentStore = undefined;
	};

	private canDeleteComment = (comment: CommentContract): boolean => {
		// If one can edit they can also delete
		return (
			this.canDeleteAllComments ||
			this.canEditAllComments ||
			(comment.author && comment.author.id === this.loginManager.loggedUserId)
		);
	};

	private canEditComment = (comment: CommentContract): boolean => {
		return (
			this.canEditAllComments ||
			(comment.author && comment.author.id === this.loginManager.loggedUserId)
		);
	};

	private processComment = (contract: CommentContract): CommentStore => {
		return new CommentStore(
			contract,
			this.canDeleteComment(contract),
			this.canEditComment(contract),
		);
	};

	@action public createComment = (): Promise<CommentStore> => {
		const comment = this.newComment;

		if (!comment) return Promise.reject();

		this.newComment = '';

		const commentContract: CommentContract = {
			author: { id: this.loginManager.loggedUserId },
			message: comment,
		};

		return this.commentRepo
			.createComment({
				entryId: this.entryId,
				contract: commentContract,
			})
			.then((result) => {
				const processed = this.processComment(result);
				this.paging.setTotalItems(this.paging.totalItems + 1);

				if (this.ascending) {
					runInAction(() => {
						this.comments.push(processed);
					});
					this.paging.goToLastPage();
				} else {
					runInAction(() => {
						this.comments.unshift(processed);
					});
					this.paging.goToFirstPage();
				}

				return _.clone(processed);
			});
	};

	@action public deleteComment = (comment: CommentStore): void => {
		_.remove(this.comments, comment);

		this.commentRepo.deleteComment({ commentId: comment.id! });
		this.paging.setTotalItems(this.paging.totalItems - 1);
	};

	@action private setComments = (commentContracts: CommentContract[]): void => {
		var commentStores = _.sortBy(
			_.map(commentContracts, (comment) => this.processComment(comment)),
			(comment) => comment.created,
		);

		this.paging.setTotalItems(commentContracts.length);

		if (this.ascending) this.paging.goToLastPage();
		else commentStores = commentStores.reverse();

		this.comments = commentStores;
	};

	@action public initComments = (): void => {
		if (this.commentsLoaded) return;

		this.commentRepo
			.getComments({ entryId: this.entryId })
			.then((contracts) => {
				this.setComments(contracts);
			});

		this.commentsLoaded = true;
	};

	@action public saveEditedComment = (): void => {
		if (!this.editCommentStore) return;

		this.editCommentStore.saveChanges();
		const editedContract = this.editCommentStore.toContract();

		this.commentRepo.updateComment({
			commentId: editedContract.id!,
			contract: editedContract,
		});

		this.editCommentStore = undefined;
	};
}
