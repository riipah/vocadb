import CommentContract from '@DataContracts/CommentContract';
import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import UserBaseContract from '@DataContracts/User/UserBaseContract';
import EntryType from '@Models/EntryType';
import UserEventRelationshipType from '@Models/Users/UserEventRelationshipType';
import CommentRepository from '@Repositories/CommentRepository';
import ReleaseEventRepository from '@Repositories/ReleaseEventRepository';
import UserRepository from '@Repositories/UserRepository';
import HttpClient from '@Shared/HttpClient';
import ui from '@Shared/MessagesTyped';
import UrlMapper from '@Shared/UrlMapper';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { ObservableArray } from 'knockout';
import _ from 'lodash';

import EditableCommentsViewModel from '../EditableCommentsViewModel';
import { IEntryReportType } from '../ReportEntryViewModel';
import ReportEntryViewModel from '../ReportEntryViewModel';
import TagListViewModel from '../Tag/TagListViewModel';
import TagsEditViewModel from '../Tag/TagsEditViewModel';

export default class ReleaseEventDetailsViewModel {
	public constructor(
		public readonly vocaDbContext: VocaDbContext,
		httpClient: HttpClient,
		urlMapper: UrlMapper,
		private readonly repo: ReleaseEventRepository,
		private readonly userRepo: UserRepository,
		latestComments: CommentContract[],
		reportTypes: IEntryReportType[],
		private readonly eventId: number,
		eventAssociationType: UserEventRelationshipType,
		usersAttending: UserBaseContract[],
		tagUsages: TagUsageForApiContract[],
		canDeleteAllComments: boolean,
	) {
		const commentRepo = new CommentRepository(
			httpClient,
			EntryType.ReleaseEvent,
		);
		this.comments = new EditableCommentsViewModel(
			vocaDbContext,
			commentRepo,
			eventId,
			canDeleteAllComments,
			canDeleteAllComments,
			false,
			latestComments,
			true,
		);
		this.eventAssociationType(eventAssociationType);
		this.usersAttending = ko.observableArray(usersAttending);

		this.reportViewModel = new ReportEntryViewModel(
			reportTypes,
			(reportType, notes) => {
				repo.createReport({
					entryId: eventId,
					reportType: reportType,
					notes: notes,
					versionNumber: undefined,
				});
				ui.showSuccessMessage(vdb.resources.shared.reportSent);
			},
		);

		this.tagsEditViewModel = new TagsEditViewModel(
			{
				getTagSelections: (callback): Promise<void> =>
					userRepo
						.getEventTagSelections({ eventId: this.eventId })
						.then(callback),
				saveTagSelections: (tags): Promise<void> =>
					userRepo
						.updateEventTags({ eventId: this.eventId, tags: tags })
						.then(this.tagUsages.updateTagUsages),
			},
			EntryType.ReleaseEvent,
		);

		this.tagUsages = new TagListViewModel(tagUsages);
	}

	public comments: EditableCommentsViewModel;

	private eventAssociationType = ko.observable<UserEventRelationshipType>(
		null!,
	);

	public hasEvent = ko.computed(() => {
		return !!this.eventAssociationType();
	});

	public isEventAttending = ko.computed(
		() => this.eventAssociationType() === UserEventRelationshipType.Attending,
	);

	public isEventInterested = ko.computed(
		() => this.eventAssociationType() === UserEventRelationshipType.Interested,
	);

	public removeEvent = (): void => {
		this.userRepo.deleteEventForUser({ eventId: this.eventId });
		this.eventAssociationType(null!);
		var link = _.find(
			this.usersAttending(),
			(u) => u.id === this.vocaDbContext.loggedUserId,
		)!;
		this.usersAttending.remove(link);
	};

	public reportViewModel: ReportEntryViewModel;

	public setEventAttending = (): void => {
		this.userRepo.updateEventForUser({
			eventId: this.eventId,
			associationType: UserEventRelationshipType.Attending,
		});
		this.eventAssociationType(UserEventRelationshipType.Attending);
		this.userRepo
			.getOne({ id: this.vocaDbContext.loggedUserId, fields: 'MainPicture' })
			.then((user) => {
				this.usersAttending.push(user);
			});
	};

	public setEventInterested = (): void => {
		this.userRepo.updateEventForUser({
			eventId: this.eventId,
			associationType: UserEventRelationshipType.Interested,
		});
		this.eventAssociationType(UserEventRelationshipType.Interested);
		var link = _.find(
			this.usersAttending(),
			(u) => u.id === this.vocaDbContext.loggedUserId,
		)!;
		this.usersAttending.remove(link);
	};

	public tagsEditViewModel: TagsEditViewModel;

	public tagUsages: TagListViewModel;

	public usersAttending: ObservableArray<UserBaseContract>;
}
