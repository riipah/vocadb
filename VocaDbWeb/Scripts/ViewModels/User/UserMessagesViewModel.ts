import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import UserApiContract from '@DataContracts/User/UserApiContract';
import UserMessageSummaryContract from '@DataContracts/User/UserMessageSummaryContract';
import { UserInboxType } from '@Repositories/UserRepository';
import UserRepository from '@Repositories/UserRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import $ from 'jquery';
import ko, { Computed, Observable } from 'knockout';
import _ from 'lodash';

import BasicEntryLinkViewModel from '../BasicEntryLinkViewModel';
import PagedItemsViewModel from '../PagedItemsViewModel';

export class NewMessageViewModel {
	public constructor() {
		this.receiver.id.subscribe(() => this.isReceiverInvalid(false));
	}

	public body = ko.observable<string>('');

	public highPriority = ko.observable(false);

	public isReceiverInvalid = ko.observable(false);

	public isSending = ko.observable(false);

	public receiver = new BasicEntryLinkViewModel<UserApiContract>();

	public subject = ko.observable<string>('');

	public clear = (): void => {
		this.body('');
		this.highPriority(false);
		this.receiver.clear();
		this.subject('');
	};

	public toContract = (senderId: number): UserApiContract => {
		return {
			body: this.body(),
			highPriority: this.highPriority(),
			receiver: this.receiver.entry(),
			sender: { id: senderId } as UserApiContract,
			subject: this.subject(),
			id: null!,
		} as UserApiContract;
	};
}

export default class UserMessagesViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private readonly userRepository: UserRepository,
		inboxType: UserInboxType,
		selectedMessageId?: number,
		receiverName?: string,
	) {
		this.notifications = new UserMessageFolderViewModel(
			vocaDbContext,
			userRepository,
			UserInboxType.Notifications,
			inboxType !== UserInboxType.Notifications,
		);
		this.receivedMessages = new UserMessageFolderViewModel(
			vocaDbContext,
			userRepository,
			UserInboxType.Received,
			inboxType !== UserInboxType.Received,
		);
		this.sentMessages = new UserMessageFolderViewModel(
			vocaDbContext,
			userRepository,
			UserInboxType.Sent,
			false,
		);

		this.inboxes = [
			this.receivedMessages,
			this.notifications,
			this.sentMessages,
		];

		var inbox = _.find(this.inboxes, (i) => i.inbox === inboxType)!;

		inbox.init(() => {
			if (selectedMessageId != null) {
				this.selectMessageById(selectedMessageId, inbox);
			}
		});

		if (receiverName) {
			userRepository
				.getOneByName({ username: receiverName })
				.then((result) => this.newMessageViewModel.receiver.entry(result!));
		}
	}

	private getInboxTabName = (inbox: UserInboxType): string | null => {
		switch (inbox) {
			case UserInboxType.Received:
				return '#receivedTab';
			case UserInboxType.Notifications:
				return '#notificationsTab';
			case UserInboxType.Sent:
				return '#sentTab';
		}

		return null;
	};

	private inboxes: UserMessageFolderViewModel[];

	public messageSent: () => void = null!;

	public newMessageViewModel = new NewMessageViewModel();

	public notifications: UserMessageFolderViewModel;

	public receivedMessages: UserMessageFolderViewModel;

	public sentMessages: UserMessageFolderViewModel;

	public reply = (): void => {
		if (!this.selectedMessage()) throw Error('No message selected');

		var msg = this.selectedMessage()!;
		this.newMessageViewModel.receiver.entry(msg.sender);
		this.newMessageViewModel.subject(
			msg.subject && msg.subject.indexOf('Re:') === 0
				? msg.subject
				: 'Re: ' + msg.subject,
		);

		this.selectTab('#composeTab');
	};

	public selectedMessage = ko.observable<UserMessageViewModel>();

	public selectedMessageBody: Observable<string> = ko.observable('');

	public selectMessageById = (
		messageId: number,
		inbox: UserMessageFolderViewModel,
	): void => {
		var message = _.find(inbox.items(), (msg) => msg.id === messageId);

		if (message) {
			this.selectInbox(inbox.inbox);
			this.selectMessage(message);
		}
	};

	public selectMessage = (message: UserMessageViewModel): void => {
		this.userRepository
			.getMessage({ messageId: message.id })
			.then((message) => {
				this.selectedMessageBody(message.body!);
			});

		this.receivedMessages.selectMessage(message);
		this.sentMessages.selectMessage(message);
		this.notifications.selectMessage(message);

		message.selected(true);
		message.read(true);
		this.selectedMessage(message);
	};

	private selectInbox = (inbox: UserInboxType): void => {
		this.selectTab(this.getInboxTabName(inbox)!);
	};

	public selectTab = (tabName: string): void => {
		var index = $('#tabs > ul > li > a').index($(tabName));
		$('#tabs').tabs('option', 'active', index);
	};

	public sendMessage = (): void => {
		if (this.newMessageViewModel.receiver.isEmpty()) {
			this.newMessageViewModel.isReceiverInvalid(true);
			return;
		}

		this.newMessageViewModel.isSending(true);
		var message = this.newMessageViewModel.toContract(
			this.vocaDbContext.loggedUserId,
		);
		this.userRepository
			.createMessage({
				userId: this.vocaDbContext.loggedUserId,
				contract: message,
			})
			.then(() => {
				this.newMessageViewModel.clear();
				this.sentMessages.clear();
				this.selectInbox(UserInboxType.Sent);
				if (this.messageSent) this.messageSent();
			})
			.finally(() => this.newMessageViewModel.isSending(false));
	};
}

export class UserMessageFolderViewModel extends PagedItemsViewModel<UserMessageViewModel> {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private readonly userRepo: UserRepository,
		public readonly inbox: UserInboxType,
		getMessageCount: boolean,
	) {
		super();

		this.unread = ko.computed(() => {
			return this.items().length
				? _.size(_.filter(this.items(), (msg) => !msg.read()))
				: this.unreadOnServer()!;
		});

		if (getMessageCount) {
			this.userRepo
				.getMessageSummaries({
					userId: vocaDbContext.loggedUserId,
					inbox: inbox,
					paging: { start: 0, maxEntries: 0, getTotalCount: true },
					unread: true,
					anotherUserId: undefined,
					iconSize: undefined,
				})
				.then((result) => this.unreadOnServer(result.totalCount));
		}

		this.selectAll.subscribe((selected) => {
			_.forEach(this.items(), (m) => m.checked(selected));
		});

		this.anotherUser = new BasicEntryLinkViewModel<UserApiContract>(
			null!,
			null!,
		);
		this.anotherUser.id.subscribe(this.clear);
	}

	public anotherUser: BasicEntryLinkViewModel<UserApiContract>;

	public canFilterByUser = (): boolean =>
		this.inbox === UserInboxType.Received || this.inbox === UserInboxType.Sent;

	private deleteMessage = (message: UserMessageViewModel): void => {
		this.userRepo.deleteMessage({ messageId: message.id });
		this.items.remove(message);
	};

	public deleteSelected = (): void => {
		var selected = _.chain(this.items()).filter((m) => m.checked());
		var selectedIds = selected.map((m) => m.id).value();

		if (selectedIds.length === 0) return;

		this.userRepo.deleteMessages({
			userId: this.vocaDbContext.loggedUserId,
			messageIds: selectedIds,
		});
		this.items.removeAll(selected.value());
	};

	public loadMoreItems = (
		callback: (result: PartialFindResultContract<UserMessageViewModel>) => void,
	): void => {
		this.userRepo
			.getMessageSummaries({
				userId: this.vocaDbContext.loggedUserId,
				inbox: this.inbox,
				paging: { start: this.start, maxEntries: 100, getTotalCount: true },
				unread: false,
				anotherUserId: this.anotherUser.id(),
				iconSize: 40,
			})
			.then((result) => {
				var messageViewModels = _.map(
					result.items,
					(msg) => new UserMessageViewModel(msg),
				);
				callback({ items: messageViewModels, totalCount: result.totalCount });
			});
	};

	public selectAll = ko.observable(false);

	public selectMessage = (message: UserMessageViewModel): void => {
		_.each(this.items(), (msg) => {
			if (msg !== message) msg.selected(false);
		});
	};

	public unread: Computed<number>;

	private unreadOnServer = ko.observable<number>(null!);
}

export class UserMessageViewModel {
	public constructor(data: UserMessageSummaryContract) {
		this.created = data.createdFormatted;
		this.highPriority = data.highPriority;
		this.id = data.id;
		this.inbox = data.inbox;
		this.read = ko.observable(data.read);
		this.receiver = data.receiver;
		this.sender = data.sender!;
		this.subject = data.subject;
	}

	public checked = ko.observable(false);

	public created: string;

	public highPriority: boolean;

	public id: number;

	public inbox: string;

	public read: Observable<boolean>;

	public receiver: UserApiContract;

	public selected = ko.observable(false);

	public sender: UserApiContract;

	public subject: string;
}
