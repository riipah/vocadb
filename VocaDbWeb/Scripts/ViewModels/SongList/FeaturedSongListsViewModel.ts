import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import SongListContract from '@DataContracts/Song/SongListContract';
import ResourceRepository from '@Repositories/ResourceRepository';
import SongListRepository from '@Repositories/SongListRepository';
import TagRepository from '@Repositories/TagRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import ko from 'knockout';
import _ from 'lodash';

import SongListsBaseViewModel from './SongListsBaseViewModel';

export default class FeaturedSongListsViewModel {
	public constructor(
		vocaDbContext: VocaDbContext,
		listRepo: SongListRepository,
		resourceRepo: ResourceRepository,
		tagRepo: TagRepository,
		tagIds: number[],
		categoryNames: string[],
	) {
		_.forEach(categoryNames, (categoryName) => {
			this.categories[categoryName] = new FeaturedSongListCategoryViewModel(
				vocaDbContext,
				listRepo,
				resourceRepo,
				tagRepo,
				tagIds,
				categoryName,
			);
		});

		window.onhashchange = (): void => {
			if (window.location.hash && window.location.hash.length >= 1)
				this.setCategory(window.location.hash.substr(1));
		};
	}

	public categories: {
		[index: string]: FeaturedSongListCategoryViewModel;
	} = {};

	public category = ko.observable('Concerts');

	public setCategory = (categoryName: string): void => {
		if (!categoryName) categoryName = 'Concerts';

		window.scrollTo(0, 0);
		window.location.hash = categoryName;
		this.category(categoryName);
	};
}

export class FeaturedSongListCategoryViewModel extends SongListsBaseViewModel {
	public constructor(
		vocaDbContext: VocaDbContext,
		private listRepo: SongListRepository,
		resourceRepo: ResourceRepository,
		tagRepo: TagRepository,
		tagIds: number[],
		private category: string,
	) {
		// Should figure out a better way for this.
		super(
			vocaDbContext,
			resourceRepo,
			tagRepo,
			tagIds,
			category === 'Concerts' || category === 'VocaloidRanking',
		);
	}

	public loadMoreItems = (
		callback: (result: PartialFindResultContract<SongListContract>) => void,
	): void => {
		this.listRepo
			.getFeatured({
				query: this.query(),
				category: this.category,
				paging: { start: this.start, maxEntries: 50, getTotalCount: true },
				tagIds: this.tagFilters.tagIds(),
				fields: this.fields(),
				sort: this.sort(),
			})
			.then(callback);
	};
}
