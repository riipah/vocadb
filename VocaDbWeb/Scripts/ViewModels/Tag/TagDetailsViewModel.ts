import CommentContract from '@DataContracts/CommentContract';
import TagRepository from '@Repositories/TagRepository';
import UserRepository from '@Repositories/UserRepository';
import ui from '@Shared/MessagesTyped';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Observable } from 'knockout';

import EditableCommentsViewModel from '../EditableCommentsViewModel';
import EnglishTranslatedStringViewModel from '../Globalization/EnglishTranslatedStringViewModel';
import { IEntryReportType } from '../ReportEntryViewModel';
import ReportEntryViewModel from '../ReportEntryViewModel';

export default class TagDetailsViewModel {
	public constructor(
		vocaDbContext: VocaDbContext,
		repo: TagRepository,
		private userRepo: UserRepository,
		latestComments: CommentContract[],
		reportTypes: IEntryReportType[],
		private tagId: number,
		canDeleteAllComments: boolean,
		showTranslatedDescription: boolean,
		isFollowed: boolean,
	) {
		this.comments = new EditableCommentsViewModel(
			vocaDbContext,
			repo.getComments({}),
			tagId,
			canDeleteAllComments,
			canDeleteAllComments,
			false,
			latestComments,
			true,
		);

		this.reportViewModel = new ReportEntryViewModel(
			reportTypes,
			(reportType, notes) => {
				repo.createReport({
					entryId: tagId,
					reportType: reportType,
					notes: notes,
					versionNumber: undefined,
				});

				ui.showSuccessMessage(vdb.resources.shared.reportSent);
			},
		);

		this.description = new EnglishTranslatedStringViewModel(
			showTranslatedDescription,
		);
		this.isFollowed = ko.observable(isFollowed);
		this.isLoggedIn = !!vocaDbContext.loggedUserId;
	}

	public comments: EditableCommentsViewModel;

	public followTag = (): void => {
		if (!this.isLoggedIn) return;
		this.userRepo.addFollowedTag({ tagId: this.tagId });
		this.isFollowed(true);
	};

	public unfollowTag = (): void => {
		this.userRepo.deleteFollowedTag({ tagId: this.tagId });
		this.isFollowed(false);
	};

	public isFollowed: Observable<boolean>;

	public isLoggedIn: boolean;

	public reportViewModel: ReportEntryViewModel;

	public description: EnglishTranslatedStringViewModel;
}
