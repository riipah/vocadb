import AlbumRepository from '@Repositories/AlbumRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import DeletedAlbumsViewModel from '@ViewModels/Album/DeletedAlbumsViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const albumRepo = container.get(AlbumRepository);

const AlbumDeleted = (): void => {
	$(function () {
		var viewModel = new DeletedAlbumsViewModel(vocaDbContext, albumRepo);
		ko.applyBindings(viewModel);
	});
};

export default AlbumDeleted;
