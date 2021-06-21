import VenueForEditContract from '@DataContracts/Venue/VenueForEditContract';
import UserRepository from '@Repositories/UserRepository';
import VenueRepository from '@Repositories/VenueRepository';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import VenueEditViewModel from '@ViewModels/Venue/VenueEditViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const venueRepo = container.get(VenueRepository);
const userRepo = container.get(UserRepository);

function initPage(): void {
	$('#deleteLink').button({ icons: { primary: 'ui-icon-trash' } });
	$('#restoreLink').button({ icons: { primary: 'ui-icon-trash' } });
	$('#trashLink').button({ icons: { primary: 'ui-icon-trash' } });
}

const VenueEdit = (model: VenueForEditContract): void => {
	$(function () {
		var urlMapper = new UrlMapper(vocaDbContext.baseAddress);
		var contract = model;

		var vm = new VenueEditViewModel(venueRepo, userRepo, urlMapper, contract);
		ko.applyBindings(vm);

		initPage();
	});
};

export default VenueEdit;
