import DiscussionFolderContract from '@DataContracts/Discussion/DiscussionFolderContract';
import DiscussionTopicContract from '@DataContracts/Discussion/DiscussionTopicContract';
import UserApiContract from '@DataContracts/User/UserApiContract';
import LoginManager from '@Models/LoginManager';
import { action, makeObservable, observable } from 'mobx';

export default class DiscussionTopicEditStore {
	public readonly author: UserApiContract;

	@observable public content = '';
	@action public setContent = (value: string): void => {
		this.content = value;
	};

	@observable public folderId?: number = undefined;
	@action public setFolderId = (value?: number): void => {
		this.folderId = value;
	};

	@observable public locked = false;
	@action public setLocked = (value: boolean): void => {
		this.locked = value;
	};

	@observable public name = '';
	@action public setName = (value: string): void => {
		this.name = value;
	};

	public constructor(
		loginManager: LoginManager,
		public folders: DiscussionFolderContract[],
		contract?: DiscussionTopicContract,
	) {
		makeObservable(this);

		this.author = { id: loginManager.loggedUserId, name: '' };

		if (contract) {
			this.author = contract.author;
			this.content = contract.content;
			this.folderId = contract.folderId;
			this.locked = contract.locked;
			this.name = contract.name;
		}
	}

	public toContract = (): DiscussionTopicContract => {
		return JSON.parse(JSON.stringify(this)) as DiscussionTopicContract;
	};
}
