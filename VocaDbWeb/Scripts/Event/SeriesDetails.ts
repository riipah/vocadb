import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import UserRepository from '@Repositories/UserRepository';
import { container } from '@Shared/inversify.config';
import EventSeriesDetailsViewModel from '@ViewModels/ReleaseEvent/EventSeriesDetailsViewModel';
import $ from 'jquery';
import ko from 'knockout';

const userRepo = container.get(UserRepository);

const EventSeriesDetails = (model: {
	id: number;
	tags: TagUsageForApiContract[];
}): void => {
	$(function () {
		$('#editEventLink').button({ icons: { primary: 'ui-icon-wrench' } });
		$('#createEventLink').button({ icons: { primary: 'ui-icon-plus' } });
		$('#viewVersions').button({ icons: { primary: 'ui-icon-clock' } });

		var tags = model.tags;

		var vm = new EventSeriesDetailsViewModel(userRepo, model.id, tags);
		ko.applyBindings(vm);
	});
};

export default EventSeriesDetails;
