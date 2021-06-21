import CommentContract from '@DataContracts/CommentContract';
import SongInListContract from '@DataContracts/Song/SongInListContract';
import TagBaseContract from '@DataContracts/Tag/TagBaseContract';
import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import { SongOptionalField } from '@Models/EntryOptionalFields';
import { SongOptionalFields } from '@Models/EntryOptionalFields';
import EntryType from '@Models/EntryType';
import PVServiceIcons from '@Models/PVServiceIcons';
import ResourcesManager from '@Models/ResourcesManager';
import SongType from '@Models/Songs/SongType';
import ArtistRepository from '@Repositories/ArtistRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import SongListRepository from '@Repositories/SongListRepository';
import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import EntryUrlMapper from '@Shared/EntryUrlMapper';
import ui from '@Shared/MessagesTyped';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Computed } from 'knockout';
import _ from 'lodash';

import EditableCommentsViewModel from '../EditableCommentsViewModel';
import PVPlayerViewModel from '../PVs/PVPlayerViewModel';
import PVPlayersFactory from '../PVs/PVPlayersFactory';
import AdvancedSearchFilters from '../Search/AdvancedSearchFilters';
import ArtistFilters from '../Search/ArtistFilters';
import TagFilter from '../Search/TagFilter';
import ServerSidePagingViewModel from '../ServerSidePagingViewModel';
import PlayListRepositoryForSongListAdapter from '../Song/PlayList/PlayListRepositoryForSongListAdapter';
import PlayListViewModel from '../Song/PlayList/PlayListViewModel';
import SongWithPreviewViewModel from '../Song/SongWithPreviewViewModel';
import TagListViewModel from '../Tag/TagListViewModel';
import TagsEditViewModel from '../Tag/TagsEditViewModel';

export default class SongListViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		urlMapper: UrlMapper,
		private songListRepo: SongListRepository,
		private songRepo: SongRepository,
		private userRepo: UserRepository,
		private artistRepo: ArtistRepository,
		resourceRepo: ResourceRepository,
		defaultSortRuleName: string,
		latestComments: CommentContract[],
		private listId: number,
		tagUsages: TagUsageForApiContract[],
		pvPlayersFactory: PVPlayersFactory,
		canDeleteAllComments: boolean,
	) {
		this.artistFilters = new ArtistFilters(
			vocaDbContext,
			this.artistRepo,
			false,
		);
		this.comments = new EditableCommentsViewModel(
			vocaDbContext,
			songListRepo.getComments({}),
			listId,
			canDeleteAllComments,
			canDeleteAllComments,
			false,
			latestComments,
			true,
		);

		this.resourceManager = new ResourcesManager(vocaDbContext, resourceRepo);
		this.resourceManager.loadResources(null!, 'songSortRuleNames');
		this.sortName = ko.computed(() => {
			if (this.sort() === '') return defaultSortRuleName;

			return this.resourceManager.resources().songSortRuleNames != null
				? this.resourceManager.resources().songSortRuleNames![this.sort()]
				: '';
		});

		this.tagIds = ko.computed(() => _.map(this.tags(), (t) => t.id));

		// TODO
		this.pvPlayerViewModel = new PVPlayerViewModel(
			vocaDbContext,
			urlMapper,
			songRepo,
			userRepo,
			pvPlayersFactory,
		);
		var playListRepoAdapter = new PlayListRepositoryForSongListAdapter(
			songListRepo,
			listId,
			this.query,
			this.songType,
			this.tagIds,
			this.childTags,
			this.artistFilters.artistIds,
			this.artistFilters.artistParticipationStatus,
			this.artistFilters.childVoicebanks,
			this.advancedFilters.filters,
			this.sort,
		);
		this.playlistViewModel = new PlayListViewModel(
			vocaDbContext,
			urlMapper,
			playListRepoAdapter,
			songRepo,
			userRepo,
			this.pvPlayerViewModel,
		);
		this.pvServiceIcons = new PVServiceIcons(urlMapper);

		this.advancedFilters.filters.subscribe(this.updateResultsWithTotalCount);
		this.artistFilters.artists.subscribe(this.updateResultsWithTotalCount);
		this.artistFilters.artistParticipationStatus.subscribe(
			this.updateResultsWithTotalCount,
		);
		this.artistFilters.childVoicebanks.subscribe(
			this.updateResultsWithTotalCount,
		);
		this.childTags.subscribe(this.updateResultsWithTotalCount);
		this.showTags.subscribe(this.updateResultsWithoutTotalCount);
		this.paging.page.subscribe(this.updateResultsWithoutTotalCount);
		this.paging.pageSize.subscribe(this.updateResultsWithTotalCount);
		this.songType.subscribe(this.updateResultsWithTotalCount);

		this.tagsEditViewModel = new TagsEditViewModel(
			{
				getTagSelections: (callback): Promise<void> =>
					userRepo
						.getSongListTagSelections({ songListId: this.listId })
						.then(callback),
				saveTagSelections: (tags): Promise<void> =>
					userRepo
						.updateSongListTags({ songListId: this.listId, tags: tags })
						.then(this.tagUsages.updateTagUsages),
			},
			EntryType.SongList,
		);

		this.tags.subscribe(this.updateResultsWithTotalCount);

		this.tagUsages = new TagListViewModel(tagUsages);

		this.sort.subscribe(() => this.updateCurrentMode(true));
		this.playlistMode.subscribe(() => this.updateCurrentMode(true));
		this.query.subscribe(() => this.updateCurrentMode(true));

		this.updateResultsWithTotalCount();
	}

	public addTag = (tag: TagBaseContract): number =>
		this.tags.push(new TagFilter(tag.id, tag.name, tag.urlSlug));

	public advancedFilters = new AdvancedSearchFilters();
	public artistFilters: ArtistFilters;
	public childTags = ko.observable(false);
	public comments: EditableCommentsViewModel;

	public loading = ko.observable(true); // Currently loading for data

	public mapTagUrl = (tagUsage: TagUsageForApiContract): string => {
		return EntryUrlMapper.details_tag(tagUsage.tag.id, tagUsage.tag.urlSlug);
	};

	public page = ko.observableArray<SongInListContract>([]); // Current page of items
	public paging = new ServerSidePagingViewModel(20); // Paging view model
	public pauseNotifications = false;
	public playlistMode = ko.observable(false);
	public playlistViewModel: PlayListViewModel;
	public pvPlayerViewModel: PVPlayerViewModel;
	public pvServiceIcons: PVServiceIcons;
	public query = ko.observable('');
	private resourceManager: ResourcesManager;
	public showAdvancedFilters = ko.observable(false);
	public showTags = ko.observable(false);
	public sort = ko.observable('');
	public sortName: Computed<string>;
	public songType = ko.observable(SongType[SongType.Unspecified]);
	public tagsEditViewModel: TagsEditViewModel;
	public tags = ko.observableArray<TagFilter>();
	public tagIds: Computed<number[]>;
	public tagUsages: TagListViewModel;

	public updateResultsWithTotalCount = (): void => this.updateResults(true);
	public updateResultsWithoutTotalCount = (): void => this.updateResults(false);

	private updateCurrentMode = (clearResults: boolean): void => {
		if (this.playlistMode()) {
			this.playlistViewModel.updateResultsWithTotalCount();
		} else {
			this.updateResults(clearResults);
		}
	};

	public updateResults = (clearResults: boolean = true): void => {
		// Disable duplicate updates
		if (this.pauseNotifications) return;

		this.pauseNotifications = true;
		this.loading(true);

		if (clearResults) this.paging.page(1);

		var pagingProperties = this.paging.getPagingProperties(clearResults);

		var fields = [
			SongOptionalField.AdditionalNames,
			SongOptionalField.ThumbUrl,
		];

		if (this.showTags()) fields.push(SongOptionalField.Tags);

		this.songListRepo
			.getSongs({
				listId: this.listId,
				query: this.query(),
				songTypes:
					this.songType() !== SongType[SongType.Unspecified]
						? this.songType()
						: undefined,
				tagIds: this.tagIds(),
				childTags: this.childTags(),
				artistIds: this.artistFilters.artistIds(),
				artistParticipationStatus: this.artistFilters.artistParticipationStatus(),
				childVoicebanks: this.artistFilters.childVoicebanks(),
				advancedFilters: this.advancedFilters.filters(),
				pvServices: undefined,
				paging: pagingProperties,
				fields: new SongOptionalFields(fields),
				sort: this.sort(),
				lang: this.vocaDbContext.languagePreference,
			})
			.then((result) => {
				_.each(result.items, (item) => {
					var song = item.song;
					var songAny: any = song;

					if (song.pvServices && song.pvServices !== 'Nothing') {
						songAny.previewViewModel = new SongWithPreviewViewModel(
							this.songRepo,
							this.userRepo,
							song.id,
							song.pvServices,
						);
						songAny.previewViewModel.ratingComplete =
							ui.showThankYouForRatingMessage;
					} else {
						songAny.previewViewModel = null;
					}
				});

				this.pauseNotifications = false;

				if (pagingProperties.getTotalCount)
					this.paging.totalItems(result.totalCount);

				this.page(result.items);
				this.loading(false);
			});
	};
}
