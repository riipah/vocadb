import SongListRepository from '@Repositories/SongListRepository';
import SongRepository from '@Repositories/SongRepository';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import SongListEditViewModel from '@ViewModels/SongList/SongListEditViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const songListRepo = container.get(SongListRepository);
const songRepo = container.get(SongRepository);

function initPage(urlMapper: UrlMapper, listId: number): void {
	$('#tabs').tabs();
	$('#deleteLink').button({ icons: { primary: 'ui-icon-trash' } });
	$('#trashLink').button({ icons: { primary: 'ui-icon-trash' } });

	var viewModel = new SongListEditViewModel(
		vocaDbContext,
		songListRepo,
		songRepo,
		urlMapper,
		listId,
	);
	viewModel.init(function () {
		ko.applyBindings(viewModel);
	});
}

const SongListEdit = (model: { id: number }): void => {
	$(document).ready(function () {
		var urlMapper = new UrlMapper(vocaDbContext.baseAddress);
		initPage(urlMapper, model.id);
	});
};

export default SongListEdit;
