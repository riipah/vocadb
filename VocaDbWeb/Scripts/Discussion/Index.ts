import DiscussionRepository from '@Repositories/DiscussionRepository';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import DiscussionIndexViewModel from '@ViewModels/Discussion/DiscussionIndexViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const discussionRepo = container.get(DiscussionRepository);

const DiscussionIndex = (canDeleteAllComments: boolean): void => {
	$(function () {
		moment.locale(vocaDbContext.culture);

		ko.punches.enableAll();

		var urlMapper = new UrlMapper(vocaDbContext.baseAddress);
		ko.applyBindings(
			new DiscussionIndexViewModel(
				vocaDbContext,
				discussionRepo,
				urlMapper,
				canDeleteAllComments,
			),
		);
	});
};

export default DiscussionIndex;
