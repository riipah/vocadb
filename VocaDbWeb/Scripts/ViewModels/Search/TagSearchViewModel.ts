import TagApiContract from '@DataContracts/Tag/TagApiContract';
import TagRepository from '@Repositories/TagRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import ko from 'knockout';

import SearchCategoryBaseViewModel from './SearchCategoryBaseViewModel';
import SearchViewModel from './SearchViewModel';

export default class TagSearchViewModel extends SearchCategoryBaseViewModel<TagApiContract> {
	public constructor(
		searchViewModel: SearchViewModel,
		vocaDbContext: VocaDbContext,
		private tagRepo: TagRepository,
	) {
		super(searchViewModel);

		this.allowAliases.subscribe(this.updateResultsWithTotalCount);
		this.categoryName.subscribe(this.updateResultsWithTotalCount);
		this.sort.subscribe(this.updateResultsWithTotalCount);

		this.loadResults = (
			pagingProperties,
			searchTerm,
			tag,
			childTags,
			status,
			callback,
		): void => {
			this.tagRepo
				.getList({
					queryParams: {
						start: pagingProperties.start,
						maxResults: pagingProperties.maxEntries,
						getTotalCount: pagingProperties.getTotalCount,
						lang: vocaDbContext.languagePreference,
						query: searchTerm,
						sort: this.sort(),
						allowAliases: this.allowAliases(),
						categoryName: this.categoryName(),
						fields: 'AdditionalNames,MainPicture',
					},
				})
				.then(callback);
		};
	}

	public allowAliases = ko.observable(false);
	public categoryName = ko.observable('');
	public sort = ko.observable('Name');
}
