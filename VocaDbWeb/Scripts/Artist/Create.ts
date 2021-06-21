import ArtistRepository from '@Repositories/ArtistRepository';
import TagRepository from '@Repositories/TagRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ArtistCreateViewModel from '@ViewModels/ArtistCreateViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const artistRepo = container.get(ArtistRepository);
const tagRepo = container.get(TagRepository);

const ArtistCreate = (model: any): void => {
	$(document).ready(function () {
		ko.punches.enableAll();
		var json = model;
		ko.applyBindings(
			new ArtistCreateViewModel(vocaDbContext, artistRepo, tagRepo, json),
		);
	});
};

export default ArtistCreate;
