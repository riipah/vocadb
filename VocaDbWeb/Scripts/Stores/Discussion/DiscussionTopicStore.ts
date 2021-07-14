import DiscussionFolderContract from '@DataContracts/Discussion/DiscussionFolderContract';
import DiscussionTopicContract from '@DataContracts/Discussion/DiscussionTopicContract';
import LoginManager from '@Models/LoginManager';
import DiscussionRepository from '@Repositories/DiscussionRepository';
import EditableCommentsStore from '@Stores/EditableCommentsStore';
import { action, computed, makeObservable, observable } from 'mobx';

import DiscussionTopicEditStore from './DiscussionTopicEditStore';

export default class DiscussionTopicStore {
	@observable public comments: EditableCommentsStore;

	@observable public contract: DiscussionTopicContract;
	@action public setContract = (value: DiscussionTopicContract): void => {
		this.contract = value;
	};

	@observable public editStore?: DiscussionTopicEditStore = undefined;
	@action public setEditStore = (value?: DiscussionTopicEditStore): void => {
		this.editStore = value;
	};

	public constructor(
		private readonly loginManager: LoginManager,
		private readonly discussionRepo: DiscussionRepository,
		canDeleteAllComments: boolean,
		contract: DiscussionTopicContract,
		private readonly folders: DiscussionFolderContract[],
	) {
		makeObservable(this);

		this.contract = contract;

		this.comments = new EditableCommentsStore(
			loginManager,
			discussionRepo,
			contract.id,
			canDeleteAllComments,
			canDeleteAllComments,
			true,
			contract.comments,
		);
	}

	@computed public get isBeingEdited(): boolean {
		return !!this.editStore;
	}

	@action public beginEditTopic = (): void => {
		this.editStore = new DiscussionTopicEditStore(
			this.loginManager,
			this.folders,
			this.contract,
		);
	};

	@action public cancelEdit = (): void => {
		this.editStore = undefined;
	};

	public saveEditedTopic = (): void => {
		if (!this.isBeingEdited) return;

		const editedContract = this.editStore!.toContract();

		this.discussionRepo
			.updateTopic({
				topicId: this.contract.id,
				contract: editedContract,
			})
			.then(() => {
				editedContract.id = this.contract.id;
				editedContract.created = this.contract.created;
				editedContract.canBeDeleted = this.contract.canBeDeleted;
				editedContract.canBeEdited = this.contract.canBeEdited;

				this.setContract(editedContract);
				this.setEditStore(undefined);
			});
	};
}
