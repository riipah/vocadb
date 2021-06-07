import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import UserMessageSummaryContract from '@DataContracts/User/UserMessageSummaryContract';
import EntryType from '@Models/EntryType';
import LoginManager from '@Models/LoginManager';
import EntryReportRepository from '@Repositories/EntryReportRepository';
import UserRepository from '@Repositories/UserRepository';
import { action, computed, makeObservable, observable } from 'mobx';

export default class TopBarStore {
	@action public ensureMessagesLoaded = (): void => {
		if (this.isLoaded) return;

		this.userRepo
			.getMessageSummaries({
				userId: this.loginManager.loggedUserId,
				inbox: undefined,
				paging: { maxEntries: 3, start: 0, getTotalCount: false },
				unread: true,
				anotherUserId: undefined,
				iconSize: 40,
			})
			.then(
				(messages: PartialFindResultContract<UserMessageSummaryContract>) => {
					this.unreadMessages = messages.items;
					this.isLoaded = true;
				},
			);
	};

	@observable public entryType = EntryType.Undefined;
	@action public setEntryType = (value: EntryType): void => {
		this.entryType = value;
	};

	@computed public get hasNotifications(): boolean {
		return this.reportCount > 0;
	}

	@observable public isLoaded = false;

	@observable public reportCount = 0;

	@observable public searchTerm = '';
	@action public setSearchTerm = (value: string): void => {
		this.searchTerm = value;
	};

	@observable public unreadMessages: UserMessageSummaryContract[] = [];

	@observable public unreadMessagesCount = 0;

	public constructor(
		private readonly loginManager: LoginManager,
		entryReportRepo: EntryReportRepository,
		private readonly userRepo: UserRepository,
	) {
		makeObservable(this);

		if (loginManager.canManageEntryReports) {
			entryReportRepo.getNewReportCount({}).then((count) => {
				this.reportCount = count;
			});
		}
	}
}
