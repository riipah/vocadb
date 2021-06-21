import CommentContract from '@DataContracts/CommentContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import ReleaseEventContract from '@DataContracts/ReleaseEvents/ReleaseEventContract';
import SongListContract from '@DataContracts/Song/SongListContract';
import HighchartsHelper from '@Helpers/HighchartsHelper';
import UserEventRelationshipType from '@Models/Users/UserEventRelationshipType';
import AdminRepository from '@Repositories/AdminRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import TagRepository from '@Repositories/TagRepository';
import UserRepository from '@Repositories/UserRepository';
import HttpClient from '@Shared/HttpClient';
import ui from '@Shared/MessagesTyped';
import UrlMapper from '@Shared/UrlMapper';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import { Options } from 'highcharts';
import $ from 'jquery';
import ko from 'knockout';

import DeleteEntryViewModel from '../DeleteEntryViewModel';
import EditableCommentsViewModel from '../EditableCommentsViewModel';
import SongListsBaseViewModel from '../SongList/SongListsBaseViewModel';
import AlbumCollectionViewModel from './AlbumCollectionViewModel';
import FollowedArtistsViewModel from './FollowedArtistsViewModel';
import RatedSongsSearchViewModel from './RatedSongsSearchViewModel';

export default class UserDetailsViewModel {
	private static overview = 'Overview';

	public addBan = (): void => {
		this.adminRepo
			.addIpToBanList({
				rule: { address: this.lastLoginAddress, notes: this.name },
			})
			.then((result) => {
				if (result) {
					ui.showSuccessMessage('Added to ban list');
				} else {
					ui.showErrorMessage('Already in the ban list');
				}
			});
	};

	public checkSFS = (): void => {
		this.adminRepo.checkSFS({ ip: this.lastLoginAddress }).then((html) => {
			$('#sfsCheckDialog').html(html);
			$('#sfsCheckDialog').dialog('open');
		});
	};

	public comments: EditableCommentsViewModel;
	private eventsLoaded = false;
	public events = ko.observableArray<ReleaseEventContract>([]);
	public eventsType = ko.observable(
		UserEventRelationshipType[UserEventRelationshipType.Attending],
	);

	public limitedUserViewModel = new DeleteEntryViewModel((notes) => {
		this.httpClient
			.post<void>(
				this.urlMapper.mapRelative(
					'api/users/' + this.userId + '/status-limited',
				),
				{ reason: notes, createReport: true },
			)
			.then(() => {
				window.location.reload();
			});
	});

	public reportUserViewModel = new DeleteEntryViewModel((notes) => {
		this.httpClient
			.post<boolean>(
				this.urlMapper.mapRelative('api/users/' + this.userId + '/reports'),
				{ reason: notes, reportType: 'Spamming' },
			)
			.then(() => {
				ui.showSuccessMessage(vdb.resources.shared.reportSent);
				this.reportUserViewModel.notes('');
			});
	}, true);

	public initComments = (): void => {
		this.comments.initComments();
	};

	private initEvents = (): void => {
		if (this.eventsLoaded) {
			return;
		}

		this.loadEvents();
		this.eventsLoaded = true;
	};

	private loadEvents = (): void => {
		this.userRepo
			.getEvents({
				userId: this.userId,
				relationshipType:
					UserEventRelationshipType[
						this.eventsType() as keyof typeof UserEventRelationshipType
					],
			})
			.then((events) => {
				this.events(events);
			});
	};

	private name!: string;
	public ratingsByGenreChart = ko.observable<Options>(null!);

	public view = ko.observable(UserDetailsViewModel.overview);

	private initializeView = (viewName: string): void => {
		switch (viewName) {
			case 'Albums':
				this.albumCollectionViewModel.init();
				break;
			case 'Artists':
				this.followedArtistsViewModel.init();
				break;
			case 'Comments':
				this.initComments();
				break;
			case 'CustomLists':
				this.songLists.init();
				break;
			case 'Songs':
				this.ratedSongsViewModel.init();
				break;
			case 'Events':
				this.initEvents();
				break;
		}
	};

	public setView = (viewName: string): void => {
		if (!viewName) viewName = UserDetailsViewModel.overview;

		this.initializeView(viewName);

		window.scrollTo(0, 0);
		window.location.hash =
			viewName !== UserDetailsViewModel.overview ? viewName : '';
		this.view(viewName);
	};

	public setOverview = (): void => this.setView('Overview');
	public setViewAlbums = (): void => this.setView('Albums');
	public setViewArtists = (): void => this.setView('Artists');
	public setComments = (): void => this.setView('Comments');
	public setCustomLists = (): void => this.setView('CustomLists');
	public setViewSongs = (): void => this.setView('Songs');
	public setViewEvents = (): void => this.setView('Events');

	public songLists: UserSongListsViewModel;

	public constructor(
		vocaDbContext: VocaDbContext,
		private readonly userId: number,
		private lastLoginAddress: string,
		private canEditAllComments: boolean,
		private httpClient: HttpClient,
		private urlMapper: UrlMapper,
		private userRepo: UserRepository,
		private adminRepo: AdminRepository,
		resourceRepo: ResourceRepository,
		tagRepo: TagRepository,
		public followedArtistsViewModel: FollowedArtistsViewModel,
		public albumCollectionViewModel: AlbumCollectionViewModel,
		public ratedSongsViewModel: RatedSongsSearchViewModel,
		latestComments: CommentContract[],
	) {
		var canDeleteAllComments = userId === vocaDbContext.loggedUserId;

		this.comments = new EditableCommentsViewModel(
			vocaDbContext,
			userRepo,
			userId,
			canDeleteAllComments,
			canEditAllComments,
			false,
			latestComments,
			true,
		);
		this.songLists = new UserSongListsViewModel(
			vocaDbContext,
			userId,
			userRepo,
			resourceRepo,
			tagRepo,
		);

		window.onhashchange = (): void => {
			if (window.location.hash && window.location.hash.length >= 1)
				this.setView(window.location.hash.substr(1));
		};

		userRepo.getRatingsByGenre({ userId: userId }).then((data) => {
			this.ratingsByGenreChart(
				HighchartsHelper.simplePieChart(null!, 'Songs', data),
			);
		});

		userRepo.getOne({ id: userId, fields: undefined }).then((data) => {
			this.name = data.name!;
		});

		this.eventsType.subscribe(this.loadEvents);
	}
}

export class UserSongListsViewModel extends SongListsBaseViewModel {
	public constructor(
		vocaDbContext: VocaDbContext,
		private readonly userId: number,
		private readonly userRepo: UserRepository,
		resourceRepo: ResourceRepository,
		tagRepo: TagRepository,
	) {
		super(vocaDbContext, resourceRepo, tagRepo, [], true);
	}

	public loadMoreItems = (
		callback: (result: PartialFindResultContract<SongListContract>) => void,
	): void => {
		this.userRepo
			.getSongLists({
				userId: this.userId,
				query: this.query(),
				paging: { start: this.start, maxEntries: 50, getTotalCount: true },
				tagIds: this.tagFilters.tagIds(),
				sort: this.sort(),
				fields: this.fields(),
			})
			.then(callback);
	};
}
