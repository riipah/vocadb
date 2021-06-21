import ResourceRepository from '@Repositories/ResourceRepository';
import SongListRepository from '@Repositories/SongListRepository';
import TagRepository from '@Repositories/TagRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import FeaturedSongListsViewModel from '@ViewModels/SongList/FeaturedSongListsViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const songListRepo = container.get(SongListRepository);
const resourceRepo = container.get(ResourceRepository);
const tagRepo = container.get(TagRepository);

const SongListFeatured = (
	categories: string[],
	model: {
		tagId: number[];
	},
): void => {
	moment.locale(vocaDbContext.culture);
	ko.punches.enableAll();

	$(function () {
		$('#createLink').button({ icons: { primary: 'ui-icon-plusthick' } });
		$('#importLink').button({ icons: { primary: 'ui-icon-plusthick' } });

		var tagIds = model.tagId;

		var viewModel = new FeaturedSongListsViewModel(
			vocaDbContext,
			songListRepo,
			resourceRepo,
			tagRepo,
			tagIds,
			categories,
		);
		ko.applyBindings(viewModel);

		if (window.location.hash && window.location.hash.length >= 1) {
			viewModel.setCategory(window.location.hash.substr(1));
		}
	});
};

export default SongListFeatured;
