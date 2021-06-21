import ResourcesContract from '@DataContracts/ResourcesContract';
import TagBaseContract from '@DataContracts/Tag/TagBaseContract';
import ResourcesManager from '@Models/ResourcesManager';
import Tag from '@Models/Tags/Tag';
import AlbumRepository from '@Repositories/AlbumRepository';
import ArtistRepository from '@Repositories/ArtistRepository';
import EntryRepository from '@Repositories/EntryRepository';
import ReleaseEventRepository from '@Repositories/ReleaseEventRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import SongRepository from '@Repositories/SongRepository';
import TagRepository from '@Repositories/TagRepository';
import UserRepository from '@Repositories/UserRepository';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Computed, Observable } from 'knockout';

import PVPlayersFactory from '../PVs/PVPlayersFactory';
import AlbumSearchViewModel from './AlbumSearchViewModel';
import AnythingSearchViewModel from './AnythingSearchViewModel';
import ArtistSearchViewModel from './ArtistSearchViewModel';
import EventSearchViewModel from './EventSearchViewModel';
import { ISearchCategoryBaseViewModel } from './SearchCategoryBaseViewModel';
import SongSearchViewModel from './SongSearchViewModel';
import TagFilters from './TagFilters';
import TagSearchViewModel from './TagSearchViewModel';

class SearchType {
	public static Anything = 'Anything';
	public static Artist = 'Artist';
	public static Album = 'Album';
	public static ReleaseEvent = 'ReleaseEvent';
	public static Song = 'Song';
	public static Tag = 'Tag';
}

export default class SearchViewModel {
	public constructor(
		vocaDbContext: VocaDbContext,
		urlMapper: UrlMapper,
		entryRepo: EntryRepository,
		artistRepo: ArtistRepository,
		albumRepo: AlbumRepository,
		songRepo: SongRepository,
		eventRepo: ReleaseEventRepository,
		tagRepo: TagRepository,
		resourceRepo: ResourceRepository,
		userRepo: UserRepository,
		unknownPictureUrl: string,
		searchType: string,
		searchTerm: string,
		tagIds: number[],
		sort: string,
		artistId: number[],
		childTags: boolean,
		childVoicebanks: boolean,
		eventId: number,
		artistType: string,
		albumType: string,
		songType: string,
		eventCategory: string,
		onlyWithPVs: boolean,
		onlyRatedSongs: boolean,
		since: number,
		minScore: number,
		viewMode: string,
		autoplay: boolean,
		shuffle: boolean,
		pageSize: number,
		pvPlayersFactory: PVPlayersFactory,
	) {
		this.resourcesManager = new ResourcesManager(vocaDbContext, resourceRepo);
		this.resources = this.resourcesManager.resources;
		this.tagFilters = new TagFilters(vocaDbContext, tagRepo);

		if (searchTerm) this.searchTerm(searchTerm);

		var isAlbum = searchType === SearchType.Album;
		var isSong = searchType === SearchType.Song;

		this.anythingSearchViewModel = new AnythingSearchViewModel(
			this,
			vocaDbContext,
			entryRepo,
		);
		this.artistSearchViewModel = new ArtistSearchViewModel(
			this,
			vocaDbContext,
			artistRepo,
			artistType,
		);

		this.albumSearchViewModel = new AlbumSearchViewModel(
			this,
			vocaDbContext,
			unknownPictureUrl,
			albumRepo,
			artistRepo,
			resourceRepo,
			isAlbum ? sort : null!,
			isAlbum ? artistId : null!,
			isAlbum ? childVoicebanks : null!,
			albumType,
			isAlbum ? viewMode : null!,
		);

		this.eventSearchViewModel = new EventSearchViewModel(
			this,
			vocaDbContext,
			eventRepo,
			artistRepo,
			sort,
			artistId,
			eventCategory,
		);

		this.songSearchViewModel = new SongSearchViewModel(
			this,
			vocaDbContext,
			urlMapper,
			songRepo,
			artistRepo,
			userRepo,
			eventRepo,
			resourceRepo,
			isSong ? sort : null!,
			isSong ? artistId : null!,
			isSong ? childVoicebanks : null!,
			songType,
			eventId,
			onlyWithPVs,
			onlyRatedSongs,
			since,
			isSong ? minScore : null!,
			isSong ? viewMode : null!,
			autoplay,
			shuffle,
			pvPlayersFactory,
		);

		this.tagSearchViewModel = new TagSearchViewModel(
			this,
			vocaDbContext,
			tagRepo,
		);

		if (
			tagIds != null ||
			!!artistId ||
			!!eventId ||
			artistType ||
			albumType ||
			songType ||
			eventCategory ||
			onlyWithPVs != null ||
			since ||
			minScore
		)
			this.showAdvancedFilters(true);

		if (searchType) this.searchType(searchType);

		if (tagIds) this.tagFilters.addTags(tagIds);

		if (tagIds && childTags) this.tagFilters.childTags(childTags);

		if (pageSize) this.pageSize(pageSize);

		this.pageSize.subscribe(this.updateResults);
		this.searchTerm.subscribe(this.updateResults);
		this.tagFilters.filters.subscribe(this.updateResults);
		this.draftsOnly.subscribe(this.updateResults);
		this.showTags.subscribe(this.updateResults);

		this.showAnythingSearch = ko.computed(
			() => this.searchType() === SearchType.Anything,
		);
		this.showArtistSearch = ko.computed(
			() => this.searchType() === SearchType.Artist,
		);
		this.showAlbumSearch = ko.computed(
			() => this.searchType() === SearchType.Album,
		);
		this.showSongSearch = ko.computed(
			() => this.searchType() === SearchType.Song,
		);

		this.searchType.subscribe((val) => {
			this.updateResults();
			this.currentSearchType(val);
		});

		resourceRepo
			.getList({
				cultureCode: vocaDbContext.uiCulture,
				setNames: [
					'albumSortRuleNames',
					'artistSortRuleNames',
					'artistTypeNames',
					'discTypeNames',
					'eventCategoryNames',
					'eventSortRuleNames',
					'entryTypeNames',
					'songSortRuleNames',
					'songTypeNames',
				],
			})
			.then((resources) => {
				this.resources(resources);
				this.updateResults();
			});

		tagRepo
			.getTopTags({
				lang: vocaDbContext.languagePreference,
				categoryName: Tag.commonCategory_Genres,
				entryType: undefined,
			})
			.then((result) => {
				this.genreTags(result);
			});
	}

	public albumSearchViewModel: AlbumSearchViewModel;
	public anythingSearchViewModel: AnythingSearchViewModel;
	public artistSearchViewModel: ArtistSearchViewModel;
	public eventSearchViewModel: EventSearchViewModel;
	public songSearchViewModel: SongSearchViewModel;
	public tagSearchViewModel: TagSearchViewModel;

	private currentSearchType = ko.observable(SearchType.Anything);
	public draftsOnly = ko.observable(false);
	public genreTags = ko.observableArray<TagBaseContract>();
	public pageSize = ko.observable(10);
	public resourcesManager: ResourcesManager;
	public resources: Observable<ResourcesContract>;
	public showAdvancedFilters = ko.observable(false);
	public searchTerm = ko
		.observable('')
		.extend({ rateLimit: { timeout: 300, method: 'notifyWhenChangesStop' } });
	public searchType = ko.observable(SearchType.Anything);
	public tagFilters: TagFilters;

	public showAnythingSearch: Computed<boolean>;
	public showArtistSearch: Computed<boolean>;
	public showAlbumSearch: Computed<boolean>;
	public showEventSearch = ko.computed(
		() => this.searchType() === SearchType.ReleaseEvent,
	);
	public showSongSearch: Computed<boolean>;
	public showTagSearch = ko.computed(
		() => this.searchType() === SearchType.Tag,
	);
	public showTagFilter = ko.computed(() => !this.showTagSearch());
	public showTags = ko.observable(false);
	public showDraftsFilter = ko.computed(
		() => this.searchType() !== SearchType.Tag,
	);

	public isUniversalSearch = ko.computed(
		() => this.searchType() === SearchType.Anything,
	);

	public currentCategoryViewModel = (): ISearchCategoryBaseViewModel => {
		switch (this.searchType()) {
			case SearchType.Anything:
				return this.anythingSearchViewModel;
			case SearchType.Artist:
				return this.artistSearchViewModel;
			case SearchType.Album:
				return this.albumSearchViewModel;
			case SearchType.ReleaseEvent:
				return this.eventSearchViewModel;
			case SearchType.Song:
				return this.songSearchViewModel;
			case SearchType.Tag:
				return this.tagSearchViewModel;
			default:
				return null!;
		}
	};

	public updateResults = (): void => {
		var vm = this.currentCategoryViewModel();

		if (vm != null) vm.updateResultsWithTotalCount();
	};
}
