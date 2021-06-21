import CommentContract from '@DataContracts/CommentContract';
import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import UserBaseContract from '@DataContracts/User/UserBaseContract';
import UserEventRelationshipType from '@Models/Users/UserEventRelationshipType';
import ReleaseEventRepository from '@Repositories/ReleaseEventRepository';
import UserRepository from '@Repositories/UserRepository';
import HttpClient from '@Shared/HttpClient';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ReleaseEventDetailsViewModel from '@ViewModels/ReleaseEvent/ReleaseEventDetailsViewModel';
import { IEntryReportType } from '@ViewModels/ReportEntryViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const eventRepo = container.get(ReleaseEventRepository);
const userRepo = container.get(UserRepository);

const EventDetails = (
	canDeleteAllComments: boolean,
	eventAssociationType: UserEventRelationshipType,
	model: {
		id: number;
		latestComments: CommentContract[];
		tags: TagUsageForApiContract[];
		usersAttending: UserBaseContract[];
	},
	reportTypes: IEntryReportType[],
): void => {
	$(function () {
		$('#editEventLink').button({
			disabled: $('#editEventLink').hasClass('disabled'),
			icons: { primary: 'ui-icon-wrench' },
		});
		$('#viewVersions').button({ icons: { primary: 'ui-icon-clock' } });
		$('#reportEntryLink').button({ icons: { primary: 'ui-icon-alert' } });
		$('#manageTags').button({ icons: { primary: 'ui-icon-wrench' } });

		const httpClient = new HttpClient();
		var rootPath = vocaDbContext.baseAddress;
		var urlMapper = new UrlMapper(rootPath);
		var latestComments = model.latestComments;
		var users = model.usersAttending;
		var tags = model.tags;

		var vm = new ReleaseEventDetailsViewModel(
			vocaDbContext,
			httpClient,
			urlMapper,
			eventRepo,
			userRepo,
			latestComments,
			reportTypes,
			model.id,
			eventAssociationType,
			users,
			tags,
			canDeleteAllComments,
		);
		ko.applyBindings(vm);

		$('.artistLink').vdbArtistToolTip();
	});
};

export default EventDetails;
