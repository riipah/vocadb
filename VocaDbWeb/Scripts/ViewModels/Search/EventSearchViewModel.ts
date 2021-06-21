import ReleaseEventContract from '@DataContracts/ReleaseEvents/ReleaseEventContract';
import ArtistRepository from '@Repositories/ArtistRepository';
import ReleaseEventRepository from '@Repositories/ReleaseEventRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Computed } from 'knockout';

import ArtistFilters from './ArtistFilters';
import SearchCategoryBaseViewModel from './SearchCategoryBaseViewModel';
import SearchViewModel from './SearchViewModel';

export default class EventSearchViewModel extends SearchCategoryBaseViewModel<ReleaseEventContract> {
	public constructor(
		searchViewModel: SearchViewModel,
		public readonly vocaDbContext: VocaDbContext,
		private readonly eventRepo: ReleaseEventRepository,
		artistRepo: ArtistRepository,
		sort: string,
		artistId: number[],
		category: string,
	) {
		super(searchViewModel);

		this.artistFilters = new ArtistFilters(vocaDbContext, artistRepo, false);
		this.artistFilters.selectArtists(artistId);

		if (sort) this.sort(sort);

		if (category) this.category(category);

		this.afterDate.subscribe(this.updateResultsWithTotalCount);
		this.artistFilters.filters.subscribe(this.updateResultsWithTotalCount);
		this.beforeDate.subscribe(this.updateResultsWithTotalCount);
		this.category.subscribe(this.updateResultsWithTotalCount);
		this.onlyMyEvents.subscribe(this.updateResultsWithTotalCount);
		this.sort.subscribe(this.updateResultsWithTotalCount);

		this.loadResults = (
			pagingProperties,
			searchTerm,
			tag,
			childTags,
			status,
			callback,
		): void => {
			this.eventRepo
				.getList({
					queryParams: {
						start: pagingProperties.start,
						maxResults: pagingProperties.maxEntries,
						getTotalCount: pagingProperties.getTotalCount,
						lang: vocaDbContext.languagePreference,
						query: searchTerm,
						sort: this.sort(),
						category:
							this.category() === 'Unspecified' ? null! : this.category(),
						childTags: childTags,
						tagIds: tag,
						userCollectionId: this.onlyMyEvents()
							? vocaDbContext.loggedUserId
							: null!,
						artistId: this.artistFilters.artistIds(),
						childVoicebanks: this.artistFilters.childVoicebanks(),
						includeMembers: this.artistFilters.includeMembers(),
						afterDate: this.afterDate()!,
						beforeDate: this.beforeDate()!,
						status: status,
						fields: this.fields(),
					},
				})
				.then(callback);
		};

		this.sortName = ko.computed(() => {
			return searchViewModel.resourcesManager.resources().eventSortRuleNames !=
				null
				? searchViewModel.resourcesManager.resources().eventSortRuleNames![
						this.sort()
				  ]
				: '';
		});
	}

	public afterDate = ko.observable<Date>(null!);
	public allowAliases = ko.observable(false);
	public artistFilters: ArtistFilters;
	public beforeDate = ko.observable<Date>(null!);
	public category = ko.observable('');
	public onlyMyEvents = ko.observable(false);
	public sort = ko.observable('Name');
	public sortName: Computed<string>;

	public fields = ko.computed(() =>
		this.searchViewModel.showTags()
			? 'AdditionalNames,MainPicture,Series,Venue,Tags'
			: 'AdditionalNames,MainPicture,Series,Venue',
	);

	public getCategoryName = (event: ReleaseEventContract): string => {
		var inherited = event.series ? event.series.category : event.category;

		if (!inherited || inherited === 'Unspecified') return '';

		return this.searchViewModel.resourcesManager.resources()
			.eventCategoryNames != null
			? this.searchViewModel.resourcesManager.resources().eventCategoryNames![
					inherited
			  ]
			: '';
	};
}
