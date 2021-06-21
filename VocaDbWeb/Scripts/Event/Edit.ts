import ReleaseEventContract from '@DataContracts/ReleaseEvents/ReleaseEventContract';
import ArtistRepository from '@Repositories/ArtistRepository';
import PVRepository from '@Repositories/PVRepository';
import ReleaseEventRepository from '@Repositories/ReleaseEventRepository';
import UserRepository from '@Repositories/UserRepository';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ReleaseEventEditViewModel from '@ViewModels/ReleaseEvent/ReleaseEventEditViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const eventRepo = container.get(ReleaseEventRepository);
const userRepo = container.get(UserRepository);
const pvRepo = container.get(PVRepository);
const artistRepo = container.get(ArtistRepository);

function initPage(): void {
	$('#tabs').tabs();
	$('#deleteLink').button({ icons: { primary: 'ui-icon-trash' } });
	$('#trashLink').button({ icons: { primary: 'ui-icon-trash' } });
	$('#restoreLink').button({ icons: { primary: 'ui-icon-trash' } });
}

const EventEdit = (
	artistRoleJson: { [key: string]: string },
	model: ReleaseEventContract,
): void => {
	$(function () {
		ko.punches.enableAll();

		var urlMapper = new UrlMapper(vocaDbContext.baseAddress);
		var contract = model;

		var vm = new ReleaseEventEditViewModel(
			vocaDbContext,
			eventRepo,
			userRepo,
			pvRepo,
			artistRepo,
			urlMapper,
			artistRoleJson,
			contract,
		);
		ko.applyBindings(vm);

		initPage();
	});
};

export default EventEdit;
