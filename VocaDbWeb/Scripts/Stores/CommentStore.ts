import CommentContract from '@DataContracts/CommentContract';
import UserApiContract from '@DataContracts/User/UserApiContract';
import { action, makeObservable, observable } from 'mobx';

export default class CommentStore {
	public readonly author: UserApiContract;
	public readonly authorName?: string;
	public readonly created?: Date;

	@observable public editedMessage?: string = undefined;
	@action public setEditedMessage = (value?: string): void => {
		this.editedMessage = value;
	};

	public id?: number;
	@observable public message: string;

	public constructor(
		contract: CommentContract,
		public readonly canBeDeleted: boolean,
		public readonly canBeEdited: boolean,
	) {
		makeObservable(this);

		this.author = contract.author;
		this.authorName = contract.authorName;
		this.created = contract.created;
		this.id = contract.id;
		this.message = contract.message;
	}

	@action public beginEdit = (): void => {
		this.editedMessage = this.message;
	};

	@action public saveChanges = (): void => {
		this.message = this.editedMessage!;
	};

	public toContract = (): CommentContract => {
		return { id: this.id, message: this.message, author: this.author };
	};
}
