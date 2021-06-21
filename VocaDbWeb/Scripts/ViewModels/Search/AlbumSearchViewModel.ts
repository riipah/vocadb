import AlbumContract from '@DataContracts/Album/AlbumContract';
import ResourcesManager from '@Models/ResourcesManager';
import AlbumRepository from '@Repositories/AlbumRepository';
import ArtistRepository from '@Repositories/ArtistRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Computed, Observable } from 'knockout';
import _ from 'lodash';

import ArtistFilters from './ArtistFilters';
import SearchCategoryBaseViewModel from './SearchCategoryBaseViewModel';
import SearchViewModel from './SearchViewModel';

export default class AlbumSearchViewModel extends SearchCategoryBaseViewModel<AlbumContract> {
	public constructor(
		searchViewModel: SearchViewModel,
		vocaDbContext: VocaDbContext,
		private unknownPictureUrl: string,
		private albumRepo: AlbumRepository,
		private artistRepo: ArtistRepository,
		resourceRep: ResourceRepository,
		sort: string,
		artistId: number[],
		childVoicebanks: boolean,
		albumType: string,
		viewMode: string,
	) {
		super(searchViewModel);

		if (searchViewModel) {
			this.resourceManager = searchViewModel.resourcesManager;
		} else {
			this.resourceManager = new ResourcesManager(vocaDbContext, resourceRep);
			this.resourceManager.loadResources(
				null!,
				'albumSortRuleNames',
				'discTypeNames',
			);
		}

		this.advancedFilters.filters.subscribe(this.updateResultsWithTotalCount);
		this.artistFilters = new ArtistFilters(
			vocaDbContext,
			this.artistRepo,
			childVoicebanks,
		);
		this.artistFilters.selectArtists(artistId);

		this.albumType = ko.observable(albumType || 'Unknown');
		this.sort = ko.observable(sort || 'Name');
		this.viewMode = ko.observable(viewMode || 'Details');

		this.sort.subscribe(this.updateResultsWithTotalCount);
		this.albumType.subscribe(this.updateResultsWithTotalCount);
		this.artistFilters.filters.subscribe(this.updateResultsWithTotalCount);

		this.sortName = ko.computed(() => {
			return this.resourceManager.resources().albumSortRuleNames != null
				? this.resourceManager.resources().albumSortRuleNames![this.sort()]
				: '';
		});

		this.loadResults = (
			pagingProperties,
			searchTerm,
			tags,
			childTags,
			status,
			callback,
		): void => {
			var artistIds = this.artistFilters.artistIds();

			this.albumRepo
				.getList({
					paging: pagingProperties,
					lang: vocaDbContext.languagePreference,
					query: searchTerm,
					sort: this.sort(),
					discTypes: this.albumType(),
					tags: tags,
					childTags: childTags,
					artistIds: artistIds,
					artistParticipationStatus: this.artistFilters.artistParticipationStatus(),
					childVoicebanks: this.artistFilters.childVoicebanks(),
					includeMembers: this.artistFilters.includeMembers(),
					fields: this.fields(),
					status: status,
					deleted: false,
					advancedFilters: this.advancedFilters.filters(),
				})
				.then(callback);
		};
	}

	public albumType: Observable<string>;
	public artistFilters: ArtistFilters;
	private resourceManager: ResourcesManager;
	public sort: Observable<string>;
	public sortName: Computed<string>;
	public viewMode: Observable<string>;

	public discTypeName = (discTypeStr: string): string =>
		this.resourceManager.resources().discTypeNames != null
			? this.resourceManager.resources().discTypeNames![discTypeStr]
			: '';

	public fields = ko.computed(() =>
		this.showTags()
			? 'AdditionalNames,MainPicture,ReleaseEvent,Tags'
			: 'AdditionalNames,MainPicture,ReleaseEvent',
	);

	public ratingStars = (album: AlbumContract): { enabled: boolean }[] => {
		if (!album) return [];

		var ratings = _.map([1, 2, 3, 4, 5], (rating) => {
			return {
				enabled: Math.round(album.ratingAverage) >= rating,
			};
		});
		return ratings;
	};
}
