import DiscussionFolderContract from '@DataContracts/Discussion/DiscussionFolderContract';
import DiscussionTopicContract from '@DataContracts/Discussion/DiscussionTopicContract';
import LoginManager from '@Models/LoginManager';
import DiscussionRepository from '@Repositories/DiscussionRepository';
import ServerSidePagingStore from '@Stores/ServerSidePagingStore';
import _ from 'lodash';
import {
	action,
	makeObservable,
	observable,
	reaction,
	runInAction,
} from 'mobx';

import DiscussionTopicEditStore from './DiscussionTopicEditStore';
import DiscussionTopicStore from './DiscussionTopicStore';

export default class DiscussionIndexStore {
	@observable public folders: DiscussionFolderContract[] = [];
	@observable public newTopic: DiscussionTopicEditStore;
	public readonly paging = new ServerSidePagingStore();
	@observable public recentTopics: DiscussionTopicContract[] = [];

	@observable public selectedFolder?: DiscussionFolderContract = undefined;
	@action public setSelectedFolder = (
		value?: DiscussionFolderContract,
	): void => {
		this.selectedFolder = value;
	};

	@observable public selectedTopic?: DiscussionTopicStore = undefined;
	@action public setSelectedTopic = (value?: DiscussionTopicStore): void => {
		this.selectedTopic = value;
	};

	@observable public showCreateNewTopic: boolean = false;
	@action public setShowCreateNewTopic = (value: boolean): void => {
		this.showCreateNewTopic = value;
	};

	@observable public topics: DiscussionTopicContract[] = [];

	public constructor(
		public readonly loginManager: LoginManager,
		private readonly discussionRepo: DiscussionRepository,
	) {
		makeObservable(this);

		this.newTopic = new DiscussionTopicEditStore(
			loginManager.loggedUserId,
			this.folders,
		);

		discussionRepo.getFolders({}).then((folders) => {
			this.folders = folders;
		});

		discussionRepo.getTopics({}).then((result) => {
			this.recentTopics = result.items;
		});

		reaction(
			() => this.selectedFolder,
			(folder) => {
				this.showCreateNewTopic = false;
				this.selectedTopic = undefined;
				this.paging.goToFirstPage();

				this.loadTopics(folder);
			},
		);

		reaction(() => this.paging.page, this.loadTopicsForCurrentFolder);
		reaction(() => this.paging.pageSize, this.loadTopicsForCurrentFolder);
	}

	private getFolder = (
		folderId: number,
	): DiscussionFolderContract | undefined => {
		return _.find(this.folders, (f) => f.id === folderId);
	};

	@action public selectFolderById = (folderId: number): void => {
		this.selectedFolder = this.getFolder(folderId);
	};

	@action private loadTopics = (
		folder?: DiscussionFolderContract,
	): Promise<void> => {
		if (!folder) {
			this.topics = [];

			return Promise.resolve();
		}

		const paging = this.paging.getPagingProperties(true);
		return this.discussionRepo
			.getTopicsForFolder({ folderId: folder.id, paging: paging })
			.then((result) => {
				runInAction(() => {
					this.topics = result.items;

					if (paging.getTotalCount)
						this.paging.setTotalItems(result.totalCount);
				});
			});
	};

	@action private loadTopicsForCurrentFolder = (): void => {
		this.loadTopics(this.selectedFolder);
	};

	private canDeleteTopic = (topic: DiscussionTopicContract): boolean => {
		return (
			this.loginManager.canDeleteComments ||
			topic.author?.id === this.loginManager.loggedUserId
		);
	};

	private canEditTopic = (topic: DiscussionTopicContract): boolean => {
		return (
			this.loginManager.canDeleteComments ||
			topic.author?.id === this.loginManager.loggedUserId
		);
	};

	@action public selectTopicById = (topicId?: number): void => {
		if (!topicId) {
			this.loadTopics(this.selectedFolder).then(() => {
				this.selectedTopic = undefined;
			});
			return;
		}

		this.discussionRepo.getTopic({ topicId: topicId }).then((contract) => {
			runInAction(() => {
				contract.canBeDeleted = this.canDeleteTopic(contract);
				contract.canBeEdited = this.canEditTopic(contract);

				this.selectFolderById(contract.folderId);
				this.selectedTopic = new DiscussionTopicStore();
			});
		});
	};
}
