import ArtistApiContract from '@DataContracts/Artist/ArtistApiContract';
import CommentContract from '@DataContracts/CommentContract';
import LyricsForSongContract from '@DataContracts/Song/LyricsForSongContract';
import SongApiContract from '@DataContracts/Song/SongApiContract';
import SongListBaseContract from '@DataContracts/SongListBaseContract';
import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import RatedSongForUserForApiContract from '@DataContracts/User/RatedSongForUserForApiContract';
import UserApiContract from '@DataContracts/User/UserApiContract';
import ArtistHelper from '@Helpers/ArtistHelper';
import EntryType from '@Models/EntryType';
import SongVoteRating from '@Models/SongVoteRating';
import SongType from '@Models/Songs/SongType';
import ArtistRepository from '@Repositories/ArtistRepository';
import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import HttpClient from '@Shared/HttpClient';
import ui from '@Shared/MessagesTyped';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Computed, Observable } from 'knockout';
import _ from 'lodash';

import EditableCommentsViewModel from '../EditableCommentsViewModel';
import EnglishTranslatedStringViewModel from '../Globalization/EnglishTranslatedStringViewModel';
import PVRatingButtonsViewModel from '../PVRatingButtonsViewModel';
import { IEntryReportType } from '../ReportEntryViewModel';
import ReportEntryViewModel from '../ReportEntryViewModel';
import SelfDescriptionViewModel from '../SelfDescriptionViewModel';
import TagListViewModel from '../Tag/TagListViewModel';
import TagsEditViewModel from '../Tag/TagsEditViewModel';

export class RatingsViewModel {
	public constructor() {
		const fav = SongVoteRating[SongVoteRating.Favorite];
		const like = SongVoteRating[SongVoteRating.Like];

		this.favorites = ko.computed(() =>
			_.chain(this.ratings())
				.filter((r) => !!r.user && r.rating === fav)
				.take(20)
				.map((r) => r.user!)
				.sortBy((u) => u.name)
				.value(),
		);

		this.favoritesCount = ko.computed(() =>
			_.chain(this.ratings())
				.filter((r) => r.rating === fav)
				.size()
				.value(),
		);

		this.likes = ko.computed(() =>
			_.chain(this.ratings())
				.filter((r) => !!r.user && r.rating === like)
				.take(20)
				.map((r) => r.user!)
				.sortBy((u) => u.name)
				.value(),
		);

		this.likesCount = ko.computed(() =>
			_.chain(this.ratings())
				.filter((r) => r.rating === like)
				.size()
				.value(),
		);

		this.hiddenRatingsCount = ko.computed(() =>
			_.chain(this.ratings())
				.filter((r) => !r.user)
				.size()
				.value(),
		);

		this.showFavorites = ko.computed(() => !!this.favorites().length);
		this.showLikes = ko.computed(() => !!this.likes().length);
	}

	public readonly favorites: Computed<UserApiContract[]>;

	public readonly favoritesCount: Computed<number>;

	public readonly hiddenRatingsCount: Computed<number>;

	public readonly likes: Computed<UserApiContract[]>;

	public readonly likesCount: Computed<number>;

	public readonly popupVisible = ko.observable(false);

	public readonly ratings = ko.observableArray<RatedSongForUserForApiContract>();

	public readonly showFavorites: Computed<boolean>;

	public readonly showLikes: Computed<boolean>;
}

// View model for the song details view.
export default class SongDetailsViewModel {
	public allVersionsVisible: Observable<boolean>;

	public comments: EditableCommentsViewModel;

	public getMatchedSite = (page: string): { siteUrl: string; id: number } => {
		// http://utaitedb.net/S/1234 or http://utaitedb.net/Song/Details/1234
		const regex = /(http(?:s)?:\/\/(?:(?:utaitedb\.net)|(?:vocadb\.net)|(?:touhoudb\.com))\/)(?:(?:Song)\/Details|(?:S))\/(\d+)/g;
		const match = regex.exec(page);

		if (!match || match.length < 3) return null!;

		const siteUrl = match[1].replace('http://', 'https://'); // either http://utaitedb.net/ or http://vocadb.net/
		const id = parseInt(match[2]);

		return { siteUrl: siteUrl, id: id };
	};

	private getOriginal = (linkedPages: string[]): void => {
		if (linkedPages == null || !linkedPages.length) return;

		const page = linkedPages[0];
		const match = this.getMatchedSite(page);

		if (!match) return;

		const { siteUrl, id } = match;

		// TODO: this should be cached, but first we need to make sure the other instances are not cached.
		this.repository
			.getOneWithComponents({
				baseUrl: siteUrl,
				id: id,
				fields: 'None',
				lang: this.vocaDbContext.languagePreference,
			})
			.then((song) => {
				if (song.songType === SongType[SongType.Original])
					this.originalVersion({ entry: song, url: page, domain: siteUrl });
			});
	};

	public getUsers: () => void;

	public id: number;

	public initLyrics = (): void => {
		if (!this.selectedLyrics() && this.selectedLyricsId()) {
			this.selectedLyricsId.notifySubscribers(this.selectedLyricsId());
		}
	};

	public maintenanceDialogVisible = ko.observable(false);

	public originalVersion: Observable<SongLinkWithUrl>;

	public reportViewModel: ReportEntryViewModel;

	public selectedLyrics = ko.observable<LyricsForSongContract>();

	public selectedLyricsId: Observable<number>;

	public selectedPvId: Observable<number>;

	public personalDescription: SelfDescriptionViewModel;

	public showAllVersions: () => void;

	public description: EnglishTranslatedStringViewModel;

	public songInListsDialog: SongInListsViewModel;

	public songListDialog: SongListsViewModel;

	public tagsEditViewModel: TagsEditViewModel;

	public tagUsages: TagListViewModel;

	public ratingsDialogViewModel = new RatingsViewModel();

	public userRating: PVRatingButtonsViewModel;

	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private readonly httpClient: HttpClient,
		private repository: SongRepository,
		userRepository: UserRepository,
		artistRepository: ArtistRepository,
		resources: SongDetailsResources,
		showTranslatedDescription: boolean,
		data: SongDetailsAjax,
		reportTypes: IEntryReportType[],
		canDeleteAllComments: boolean,
		ratingCallback: () => void,
	) {
		this.id = data.id;
		this.userRating = new PVRatingButtonsViewModel(
			userRepository,
			{ id: data.id, vote: data.userRating },
			ratingCallback,
		);

		this.allVersionsVisible = ko.observable(false);

		this.comments = new EditableCommentsViewModel(
			vocaDbContext,
			repository,
			this.id,
			canDeleteAllComments,
			canDeleteAllComments,
			false,
			data.latestComments,
			true,
		);

		this.getUsers = (): void => {
			repository.getRatings({ songId: this.id }).then((result) => {
				this.ratingsDialogViewModel.ratings(result);
				this.ratingsDialogViewModel.popupVisible(true);
			});
		};

		this.originalVersion = ko.observable({ entry: data.originalVersion! });

		this.reportViewModel = new ReportEntryViewModel(
			reportTypes,
			(reportType, notes) => {
				repository.createReport({
					songId: this.id,
					reportType: reportType,
					notes: notes,
					versionNumber: undefined,
				});

				ui.showSuccessMessage(vdb.resources.shared.reportSent);
			},
		);

		this.personalDescription = new SelfDescriptionViewModel(
			vocaDbContext,
			data.personalDescriptionAuthor!,
			data.personalDescriptionText!,
			artistRepository,
			(callback) => {
				repository
					.getOneWithComponents({
						id: this.id,
						fields: 'Artists',
						lang: vocaDbContext.languagePreference,
					})
					.then((result) => {
						var artists = _.chain(result.artists!)
							.filter(ArtistHelper.isValidForPersonalDescription)
							.map((a) => a.artist)
							.value();
						callback(artists);
					});
			},
			(vm) =>
				repository.updatePersonalDescription({
					songId: this.id,
					text: vm.text(),
					author: vm.author.entry(),
				}),
		);

		this.showAllVersions = (): void => {
			this.allVersionsVisible(true);
		};

		this.songInListsDialog = new SongInListsViewModel(repository, this.id);
		this.songListDialog = new SongListsViewModel(
			repository,
			resources,
			this.id,
		);
		this.selectedLyricsId = ko.observable(data.selectedLyricsId);
		this.selectedPvId = ko.observable(data.selectedPvId);
		this.description = new EnglishTranslatedStringViewModel(
			showTranslatedDescription,
		);

		this.tagsEditViewModel = new TagsEditViewModel(
			{
				getTagSelections: (callback): Promise<void> =>
					userRepository
						.getSongTagSelections({ songId: this.id })
						.then(callback),
				saveTagSelections: (tags): Promise<void> =>
					userRepository
						.updateSongTags({ songId: this.id, tags: tags })
						.then(this.tagUsages.updateTagUsages),
			},
			EntryType.Song,
			(callback) =>
				repository.getTagSuggestions({ songId: this.id }).then(callback),
		);

		this.tagUsages = new TagListViewModel(data.tagUsages);

		if (
			data.songType !== SongType[SongType.Original] &&
			this.originalVersion().entry == null
		) {
			this.getOriginal(data.linkedPages!);
		}

		this.selectedLyricsId.subscribe((id) => {
			this.selectedLyrics(null!);
			repository
				.getLyrics({ lyricsId: id, songVersion: data.version })
				.then((lyrics) => this.selectedLyrics(lyrics));
		});
	}
}

export class SongInListsViewModel {
	public contentHtml = ko.observable<string>();

	public dialogVisible = ko.observable(false);

	public show: () => void;

	public constructor(repository: SongRepository, songId: number) {
		this.show = (): void => {
			repository.songListsForSong({ songId: songId }).then((result) => {
				this.contentHtml(result);
				this.dialogVisible(true);
			});
		};
	}
}

export class SongListsViewModel {
	public static readonly tabName_Personal = 'Personal';
	public static readonly tabName_Featured = 'Featured';
	public static readonly tabName_New = 'New';

	public addedToList!: () => void;

	public addSongToList: () => void;

	public dialogVisible = ko.observable(false);

	private featuredLists = ko.observableArray<SongListBaseContract>();

	public newListName = ko.observable('');

	public notes = ko.observable('');

	private personalLists = ko.observableArray<SongListBaseContract>();

	public selectedListId: Observable<number | null> = ko.observable(null!);

	public showSongLists: () => void;

	public tabName = ko.observable(SongListsViewModel.tabName_Personal);

	public songLists = ko.computed(() =>
		this.tabName() === SongListsViewModel.tabName_Personal
			? this.personalLists()
			: this.featuredLists(),
	);

	public constructor(
		repository: SongRepository,
		resources: SongDetailsResources,
		songId: number,
	) {
		var isValid = (): boolean => {
			return this.selectedListId() != null || this.newListName().length > 0;
		};

		this.addSongToList = (): void => {
			if (isValid()) {
				const listId =
					this.tabName() !== SongListsViewModel.tabName_New
						? this.selectedListId() || 0
						: 0;
				repository
					.addSongToList({
						listId: listId,
						songId: songId,
						notes: this.notes(),
						newListName: this.newListName(),
					})
					.then(() => {
						this.notes('');
						this.dialogVisible(false);

						if (this.addedToList) this.addedToList();
					});
			}
		};

		this.showSongLists = (): void => {
			repository
				.songListsForUser({ ignoreSongId: songId })
				.then((songLists) => {
					var personalLists = _.filter(
						songLists,
						(list) => list.featuredCategory === 'Nothing',
					);
					var featuredLists = _.filter(
						songLists,
						(list) => list.featuredCategory !== 'Nothing',
					);

					this.personalLists(personalLists);
					this.featuredLists(featuredLists);

					if (personalLists.length)
						this.tabName(SongListsViewModel.tabName_Personal);
					else if (featuredLists.length)
						this.tabName(SongListsViewModel.tabName_Featured);
					else this.tabName(SongListsViewModel.tabName_New);

					this.newListName('');
					this.selectedListId(
						this.songLists().length > 0 ? this.songLists()[0].id : null!,
					);
					this.dialogVisible(true);
				});
		};
	}
}

export interface SongDetailsAjax {
	id: number;

	latestComments: CommentContract[];

	linkedPages?: string[];

	originalVersion?: SongApiContract;

	selectedLyricsId: number;

	selectedPvId: number;

	personalDescriptionText?: string;

	personalDescriptionAuthor?: ArtistApiContract;

	songType: string;

	tagUsages: TagUsageForApiContract[];

	userRating: string;

	version: number;
}

export interface SongDetailsResources {
	addedToList?: string;

	createNewList: string;
}

export interface SongLinkWithUrl {
	entry: SongApiContract;

	url?: string;

	domain?: string;
}
