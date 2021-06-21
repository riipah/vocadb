import ArtistRepository from '@Repositories/ArtistRepository';
import SongRepository from '@Repositories/SongRepository';
import TagRepository from '@Repositories/TagRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import SongCreateViewModel from '@ViewModels/SongCreateViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const songRepo = container.get(SongRepository);
const artistRepo = container.get(ArtistRepository);
const tagRepo = container.get(TagRepository);

const SongCreate = (model: any): void => {
	$(document).ready(function () {
		ko.punches.enableAll();
		var json = model;
		ko.applyBindings(
			new SongCreateViewModel(
				vocaDbContext,
				songRepo,
				artistRepo,
				tagRepo,
				json,
			),
		);

		$('#pvLoader')
			.ajaxStart(function (this: any) {
				$(this).show();
			})
			.ajaxStop(function (this: any) {
				$(this).hide();
			});
	});
};

export default SongCreate;
