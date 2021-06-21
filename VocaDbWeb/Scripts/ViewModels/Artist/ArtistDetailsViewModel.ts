import CommentContract from '@DataContracts/CommentContract';
import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import HighchartsHelper from '@Helpers/HighchartsHelper';
import TimeUnit from '@Models/Aggregate/TimeUnit';
import EntryType from '@Models/EntryType';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import AlbumRepository from '@Repositories/AlbumRepository';
import ArtistRepository from '@Repositories/ArtistRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import ui from '@Shared/MessagesTyped';
import UrlMapper from '@Shared/UrlMapper';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import { Options } from 'highcharts';
import ko, { Observable } from 'knockout';

import EditableCommentsViewModel from '../EditableCommentsViewModel';
import EnglishTranslatedStringViewModel from '../Globalization/EnglishTranslatedStringViewModel';
import PVPlayersFactory from '../PVs/PVPlayersFactory';
import { IEntryReportType } from '../ReportEntryViewModel';
import ReportEntryViewModel from '../ReportEntryViewModel';
import AlbumSearchViewModel from '../Search/AlbumSearchViewModel';
import SongSearchViewModel from '../Search/SongSearchViewModel';
import TagListViewModel from '../Tag/TagListViewModel';
import TagsEditViewModel from '../Tag/TagsEditViewModel';

export default class ArtistDetailsViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		repo: ArtistRepository,
		private artistId: number,
		tagUsages: TagUsageForApiContract[],
		hasSubscription: boolean,
		emailNotifications: boolean,
		siteNotifications: boolean,
		hasEnglishDescription: boolean,
		private unknownPictureUrl: string,
		private urlMapper: UrlMapper,
		private albumRepo: AlbumRepository,
		private songRepo: SongRepository,
		private resourceRepo: ResourceRepository,
		private userRepository: UserRepository,
		reportTypes: IEntryReportType[],
		canDeleteAllComments: boolean,
		private pvPlayersFactory: PVPlayersFactory,
		latestComments: CommentContract[],
	) {
		this.hasArtistSubscription = ko.observable(hasSubscription);
		this.customizeSubscriptionDialog = new CustomizeArtistSubscriptionViewModel(
			artistId,
			emailNotifications,
			siteNotifications,
			userRepository,
		);
		this.description = new EnglishTranslatedStringViewModel(
			hasEnglishDescription &&
				(vocaDbContext.languagePreference ===
					ContentLanguagePreference.English ||
					vocaDbContext.languagePreference ===
						ContentLanguagePreference.Romaji),
		);

		this.comments = new EditableCommentsViewModel(
			vocaDbContext,
			repo,
			artistId,
			canDeleteAllComments,
			canDeleteAllComments,
			false,
			latestComments,
			true,
		);

		this.tagsEditViewModel = new TagsEditViewModel(
			{
				getTagSelections: (callback): Promise<void> =>
					userRepository
						.getArtistTagSelections({ artistId: artistId })
						.then(callback),
				saveTagSelections: (tags): Promise<void> =>
					userRepository
						.updateArtistTags({ artistId: artistId, tags: tags })
						.then(this.tagUsages.updateTagUsages),
			},
			EntryType.Artist,
			(callback) =>
				repo.getTagSuggestions({ artistId: this.artistId }).then(callback),
		);

		this.tagUsages = new TagListViewModel(tagUsages);

		this.reportViewModel = new ReportEntryViewModel(
			reportTypes,
			(reportType, notes) => {
				repo.createReport({
					artistId: this.artistId,
					reportType: reportType,
					notes: notes,
					versionNumber: undefined,
				});

				ui.showSuccessMessage(vdb.resources.shared.reportSent);
			},
		);

		this.loadHighcharts();
	}

	public addFollowedArtist = (): void => {
		this.userRepository
			.createArtistSubscription({ artistId: this.artistId })
			.then(() => {
				this.hasArtistSubscription(true);
				this.customizeSubscriptionDialog.notificationsMethod('Site');
			});
	};

	public comments: EditableCommentsViewModel;

	public customizeSubscriptionDialog: CustomizeArtistSubscriptionViewModel;

	public hasArtistSubscription: Observable<boolean>;

	private loadHighcharts = (): void => {
		// Delayed load highcharts stuff
		const highchartsPromise = import('highcharts');
		var songsPerMonthDataPromise = this.songRepo.getOverTime({
			timeUnit: TimeUnit.month,
			artistId: this.artistId,
		});

		Promise.all([songsPerMonthDataPromise, highchartsPromise]).then(
			([points]) => {
				// Need at least 2 points because lone point looks weird
				if (points && points.length >= 2) {
					this.songsOverTimeChart(
						HighchartsHelper.dateLineChartWithAverage(
							'Songs per month',
							null!,
							'Songs',
							points,
						),
					);
				}
			},
		);
	};

	public removeFollowedArtist = (): void => {
		this.userRepository
			.deleteArtistSubscription({ artistId: this.artistId })
			.then(() => {
				this.hasArtistSubscription(false);
			});
	};

	public showAllMembers = ko.observable(false);
	public description: EnglishTranslatedStringViewModel;
	public songsViewModel: Observable<SongSearchViewModel | null> = ko.observable(
		null!,
	);

	public songsOverTimeChart = ko.observable<Options>(null!);

	public collaborationAlbumsViewModel: Observable<AlbumSearchViewModel | null> = ko.observable(
		null!,
	);
	public mainAlbumsViewModel: Observable<AlbumSearchViewModel | null> = ko.observable(
		null!,
	);

	public reportViewModel: ReportEntryViewModel;

	public tagsEditViewModel: TagsEditViewModel;

	public tagUsages: TagListViewModel;

	public initMainAlbums = (): void => {
		if (this.mainAlbumsViewModel()) return;

		this.mainAlbumsViewModel(
			new AlbumSearchViewModel(
				null!,
				this.vocaDbContext,
				this.unknownPictureUrl,
				this.albumRepo,
				null!,
				this.resourceRepo,
				null!,
				[this.artistId],
				null!,
				'Unknown',
				null!,
			),
		);
		this.mainAlbumsViewModel()!.artistFilters.artistParticipationStatus(
			'OnlyMainAlbums',
		);
	};

	public initCollaborationAlbums = (): void => {
		if (this.collaborationAlbumsViewModel()) return;

		this.collaborationAlbumsViewModel(
			new AlbumSearchViewModel(
				null!,
				this.vocaDbContext,
				this.unknownPictureUrl,
				this.albumRepo,
				null!,
				this.resourceRepo,
				null!,
				[this.artistId],
				null!,
				'Unknown',
				null!,
			),
		);
		this.collaborationAlbumsViewModel()!.artistFilters.artistParticipationStatus(
			'OnlyCollaborations',
		);
	};

	public initSongs = (): void => {
		if (this.songsViewModel()) return;

		this.songsViewModel(
			new SongSearchViewModel(
				null!,
				this.vocaDbContext,
				this.urlMapper,
				this.songRepo,
				null!,
				this.userRepository,
				null!,
				this.resourceRepo,
				null!,
				[this.artistId],
				null!,
				null!,
				null!,
				false,
				false,
				null!,
				null!,
				null!,
				null!,
				null!,
				this.pvPlayersFactory,
			),
		);
		this.songsViewModel()!.updateResults(true);
	};
}

export class CustomizeArtistSubscriptionViewModel {
	public dialogVisible = ko.observable(false);

	public notificationsMethod: Observable<string>;

	public constructor(
		artistId: number,
		emailNotifications: boolean,
		siteNotifications: boolean,
		userRepository: UserRepository,
	) {
		this.notificationsMethod = ko.observable(
			!siteNotifications ? 'Nothing' : !emailNotifications ? 'Site' : 'Email',
		);

		this.notificationsMethod.subscribe((method) => {
			userRepository.updateArtistSubscription({
				artistId: artistId,
				emailNotifications: method === 'Email',
				siteNotifications: method === 'Site' || method === 'Email',
			});
		});
	}

	public show = (): void => {
		this.dialogVisible(true);
	};
}
