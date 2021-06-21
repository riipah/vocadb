import AlbumRepository from '@Repositories/AlbumRepository';
import ArtistRepository from '@Repositories/ArtistRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import AlbumCreateViewModel from '@ViewModels/Album/AlbumCreateViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const albumRepo = container.get(AlbumRepository);
const artistRepo = container.get(ArtistRepository);

const AlbumCreate = (): void => {
	$(function () {
		ko.applyBindings(
			new AlbumCreateViewModel(vocaDbContext, albumRepo, artistRepo),
		);
	});
};

export default AlbumCreate;
