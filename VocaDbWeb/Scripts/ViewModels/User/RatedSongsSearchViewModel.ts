import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import SongApiContract from '@DataContracts/Song/SongApiContract';
import SongListBaseContract from '@DataContracts/SongListBaseContract';
import TagBaseContract from '@DataContracts/Tag/TagBaseContract';
import RatedSongForUserForApiContract from '@DataContracts/User/RatedSongForUserForApiContract';
import PVServiceIcons from '@Models/PVServiceIcons';
import ArtistRepository from '@Repositories/ArtistRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import SongRepository from '@Repositories/SongRepository';
import TagRepository from '@Repositories/TagRepository';
import UserRepository from '@Repositories/UserRepository';
import ui from '@Shared/MessagesTyped';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import ko from 'knockout';
import _ from 'lodash';
import moment from 'moment';

import PVPlayerViewModel from '../PVs/PVPlayerViewModel';
import PVPlayersFactory from '../PVs/PVPlayersFactory';
import AdvancedSearchFilters from '../Search/AdvancedSearchFilters';
import ArtistFilters from '../Search/ArtistFilters';
import TagFilter from '../Search/TagFilter';
import TagFilters from '../Search/TagFilters';
import ServerSidePagingViewModel from '../ServerSidePagingViewModel';
import PlayListRepositoryForRatedSongsAdapter from '../Song/PlayList/PlayListRepositoryForRatedSongsAdapter';
import PlayListViewModel from '../Song/PlayList/PlayListViewModel';
import SongWithPreviewViewModel from '../Song/SongWithPreviewViewModel';

export default class RatedSongsSearchViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		urlMapper: UrlMapper,
		private userRepo: UserRepository,
		private artistRepo: ArtistRepository,
		private songRepo: SongRepository,
		private resourceRepo: ResourceRepository,
		tagRepo: TagRepository,
		private loggedUserId: number,
		sort: string,
		groupByRating: boolean,
		pvPlayersFactory: PVPlayersFactory,
		initialize = true,
		artistId?: number,
		childVoicebanks?: boolean,
	) {
		this.artistFilters = new ArtistFilters(
			vocaDbContext,
			artistRepo,
			childVoicebanks,
		);

		if (artistId) this.artistFilters.selectArtist(artistId);

		this.pvServiceIcons = new PVServiceIcons(urlMapper);

		if (sort) this.sort(sort);

		if (groupByRating != null) this.groupByRating(groupByRating);

		this.tagFilters = new TagFilters(vocaDbContext, tagRepo);

		this.advancedFilters.filters.subscribe(this.updateResultsWithTotalCount);
		this.artistFilters.filters.subscribe(this.updateResultsWithTotalCount);
		this.groupByRating.subscribe(this.updateResultsWithoutTotalCount);
		this.paging.page.subscribe(this.updateResultsWithoutTotalCount);
		this.paging.pageSize.subscribe(this.updateResultsWithTotalCount);
		this.rating.subscribe(this.updateResultsWithTotalCount);
		this.searchTerm.subscribe(this.updateResultsWithTotalCount);
		this.showTags.subscribe(this.updateResultsWithoutTotalCount);
		this.songListId.subscribe(this.updateResultsWithTotalCount);
		this.sort.subscribe(this.updateResultsWithoutTotalCount);
		this.tagFilters.tags.subscribe(this.updateResultsWithTotalCount);
		this.viewMode.subscribe(this.updateResultsWithTotalCount);

		this.pvPlayerViewModel = new PVPlayerViewModel(
			vocaDbContext,
			urlMapper,
			songRepo,
			userRepo,
			pvPlayersFactory,
		);
		var songsRepoAdapter = new PlayListRepositoryForRatedSongsAdapter(
			userRepo,
			loggedUserId,
			this.searchTerm,
			this.sort,
			this.tagFilters.tagIds,
			this.artistFilters.artistIds,
			this.artistFilters.childVoicebanks,
			this.rating,
			this.songListId,
			this.advancedFilters.filters,
			this.groupByRating,
			ko.observable('AdditionalNames,ThumbUrl'),
		);
		this.playListViewModel = new PlayListViewModel(
			vocaDbContext,
			urlMapper,
			songsRepoAdapter,
			songRepo,
			userRepo,
			this.pvPlayerViewModel,
		);

		if (initialize) this.init();
	}

	public advancedFilters = new AdvancedSearchFilters();
	public artistFilters: ArtistFilters;
	public groupByRating = ko.observable(true);
	public isInit = false;
	public loading = ko.observable(true); // Currently loading for data
	public page = ko.observableArray<IRatedSongSearchItem>([]); // Current page of items
	public paging = new ServerSidePagingViewModel(20); // Paging view model
	public pauseNotifications = false;
	public playListViewModel: PlayListViewModel;
	public pvPlayerViewModel: PVPlayerViewModel;
	public pvServiceIcons: PVServiceIcons;
	public rating = ko.observable('Nothing');
	public resources = ko.observable<any>();
	public searchTerm = ko
		.observable('')
		.extend({ rateLimit: { timeout: 300, method: 'notifyWhenChangesStop' } });

	public selectTag = (tag: TagBaseContract): void => {
		this.tagFilters.tags([TagFilter.fromContract(tag)]);
	};

	public showTags = ko.observable(false);
	public songListId = ko.observable<number>(undefined!);
	public songLists = ko.observableArray<SongListBaseContract>([]);
	public sort = ko.observable('Name');
	public sortName = ko.computed(() =>
		this.resources() != null
			? this.resources().user_ratedSongForUserSortRuleNames[this.sort()] ||
			  this.resources().songSortRuleNames[this.sort()]
			: '',
	);
	public tagFilters: TagFilters;
	public viewMode = ko.observable('Details');

	public fields = ko.computed(() => {
		return 'AdditionalNames,ThumbUrl' + (this.showTags() ? ',Tags' : '');
	});

	public formatDate = (dateStr: string): string => {
		return moment(dateStr).format('l');
	};

	public getPVServiceIcons = (
		services: string,
	): { service: string; url: string }[] => {
		return this.pvServiceIcons.getIconUrls(services);
	};

	public init = (): void => {
		if (this.isInit) return;

		this.userRepo
			.getSongLists({
				userId: this.loggedUserId,
				query: undefined,
				paging: { start: 0, maxEntries: 50, getTotalCount: false },
				tagIds: [],
				sort: 'Name',
				fields: undefined,
			})
			.then((songLists) => this.songLists(songLists.items));

		this.resourceRepo
			.getList({
				cultureCode: this.vocaDbContext.uiCulture,
				setNames: [
					'songSortRuleNames',
					'user_ratedSongForUserSortRuleNames',
					'songTypeNames',
				],
			})
			.then((resources) => {
				this.resources(resources);
				this.updateResultsWithTotalCount();
				this.isInit = true;
			});
	};

	public updateResultsWithTotalCount = (): void => this.updateResults(true);
	public updateResultsWithoutTotalCount = (): void => this.updateResults(false);

	public updateResults = (clearResults: boolean = true): void => {
		// Disable duplicate updates
		if (this.pauseNotifications) return;

		this.pauseNotifications = true;
		this.loading(true);

		if (clearResults) this.paging.page(1);

		var pagingProperties = this.paging.getPagingProperties(clearResults);

		if (this.viewMode() === 'PlayList') {
			this.playListViewModel.updateResultsWithTotalCount(() => {
				this.pauseNotifications = false;
				this.loading(false);
			});
			return;
		}

		this.userRepo
			.getRatedSongsList({
				userId: this.loggedUserId,
				paging: pagingProperties,
				lang: this.vocaDbContext.languagePreference,
				query: this.searchTerm(),
				tagIds: this.tagFilters.tagIds(),
				artistIds: this.artistFilters.artistIds(),
				childVoicebanks: this.artistFilters.childVoicebanks(),
				rating: this.rating(),
				songListId: this.songListId()!,
				advancedFilters: this.advancedFilters.filters(),
				groupByRating: this.groupByRating(),
				pvServices: undefined,
				fields: this.fields(),
				sort: this.sort(),
			})
			.then(
				(result: PartialFindResultContract<RatedSongForUserForApiContract>) => {
					var songs: IRatedSongSearchItem[] = [];

					_.each(result.items, (item) => {
						var song: IRatedSongSearchItem = item.song!;

						song.rating = item.rating;

						if (song.pvServices && song.pvServices !== 'Nothing') {
							song.previewViewModel = new SongWithPreviewViewModel(
								this.songRepo,
								this.userRepo,
								song.id,
								song.pvServices,
							);
							song.previewViewModel.ratingComplete =
								ui.showThankYouForRatingMessage;
						} else {
							song.previewViewModel = null!;
						}

						songs.push(song);
					});

					this.pauseNotifications = false;

					if (pagingProperties.getTotalCount)
						this.paging.totalItems(result.totalCount);

					this.page(songs);
					this.loading(false);
				},
			);
	};
}

export interface IRatedSongSearchItem extends SongApiContract {
	previewViewModel?: SongWithPreviewViewModel;

	rating?: string;
}
