import HttpClient from '@Shared/HttpClient';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ImportSongListViewModel from '@ViewModels/SongList/ImportSongListViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);

const SongListImport = (): void => {
	ko.punches.enableAll();

	$(function () {
		const httpClient = new HttpClient();
		var urlMapper = new UrlMapper(vocaDbContext.baseAddress);
		var viewModel = new ImportSongListViewModel(httpClient, urlMapper);
		ko.applyBindings(viewModel);
	});
};

export default SongListImport;
