import PagingProperties from '@DataContracts/PagingPropertiesContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import SongApiContract from '@DataContracts/Song/SongApiContract';
import DateTimeHelper from '@Helpers/DateTimeHelper';
import PVHelper from '@Helpers/PVHelper';
import { SongOptionalField } from '@Models/EntryOptionalFields';
import { SongOptionalFields } from '@Models/EntryOptionalFields';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import PVServiceIcons from '@Models/PVServiceIcons';
import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Computed } from 'knockout';
import _ from 'lodash';

import { IPVPlayerSong } from '../../PVs/PVPlayerViewModel';
import PVPlayerViewModel from '../../PVs/PVPlayerViewModel';
import ServerSidePagingViewModel from '../../ServerSidePagingViewModel';

export default class PlayListViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private urlMapper: UrlMapper,
		private songListRepo: IPlayListRepository,
		private songRepo: SongRepository,
		private userRepo: UserRepository,
		private pvPlayerViewModel: PVPlayerViewModel,
	) {
		pvPlayerViewModel.nextSong = this.nextSong;
		pvPlayerViewModel.resetSong = (): void => {
			this.pvPlayerViewModel.selectedSong(
				_.find(this.page(), (song) => pvPlayerViewModel.songIsValid(song))!,
			);
		};

		pvPlayerViewModel.autoplay.subscribe(() =>
			this.updateResultsWithTotalCount(),
		);

		this.hasMoreSongs = ko.computed(() => {
			return this.page().length < this.paging.totalItems();
		});

		this.pvServiceIcons = new PVServiceIcons(urlMapper);
	}

	public formatLength = (length: number): string =>
		DateTimeHelper.formatFromSeconds(length);

	private getRandomSongIndex = (): number => {
		return Math.floor(Math.random() * this.paging.totalItems());
	};

	// Gets the index of the currently playing song.
	// -1 if the currently playing song isn't in the current list of songs, which is possible if the search filters were changed.
	private getSongIndex = (song: IPVPlayerSong): number => {
		// Might need to build a lookup for this for large playlists
		for (var i = 0; i < this.page().length; ++i) {
			if (this.page()[i].song.id === song.song.id) return i;
		}

		return -1;
	};

	// Gets a song with a specific playlist index.
	// If shuffle is enabled, this index is NOT the same as the song index in the list of songs.
	private getSongWithPlayListIndex = (index: number): ISongForPlayList => {
		// Might need to build a lookup for this for large playlists
		return _.find(this.page(), (s) => s.indexInPlayList === index)!;
	};

	private hasMoreSongs: Computed<boolean>;

	public isInit = false;

	public init = (): void => {
		if (this.isInit) return;

		this.updateResultsWithTotalCount();
		this.isInit = true;
	};

	public nextSong = (): void => {
		if (this.paging.totalItems() === 0) return;

		var index: number;

		if (this.pvPlayerViewModel.shuffle()) {
			// Get a random index
			index = this.getRandomSongIndex();

			// Check if song is already loaded
			var song = this.getSongWithPlayListIndex(index);

			if (song) {
				this.playSong(song);
			} else {
				// Song not loaded, load that one song
				this.updateResults(false, index, () => {
					this.playSong(this.getSongWithPlayListIndex(index));
				});
			}
		} else {
			// Get the index of the next song to be played
			index = this.getSongIndex(this.pvPlayerViewModel.selectedSong()!) + 1;

			if (index < this.songsLoaded()) {
				this.playSong(this.page()[index]);
			} else {
				if (this.hasMoreSongs()) {
					this.paging.nextPage();
					this.updateResults(false, null!, () => {
						this.playSong(this.page()[index]);
					});
				} else {
					this.playSong(this.page()[0]);
				}
			}
		}
	};

	public loading = ko.observable(true); // Currently loading for data
	public page = ko.observableArray<ISongForPlayList>([]); // Current page of items
	public paging = new ServerSidePagingViewModel(30); // Paging view model
	public pauseNotifications = false;
	public pvServiceIcons: PVServiceIcons;

	private playSong = (song: ISongForPlayList): void => {
		this.pvPlayerViewModel.selectedSong(song);
	};

	public scrollEnd = (): void => {
		// For now, disable autoload in shuffle mode
		if (this.hasMoreSongs() && !this.pvPlayerViewModel.shuffle()) {
			this.paging.nextPage();
			this.updateResultsWithoutTotalCount();
		}
	};

	public songsLoaded = ko.computed(() => this.page().length);

	public updateResultsWithTotalCount = (callback?: () => void): void =>
		this.updateResults(true, null!, callback);
	public updateResultsWithoutTotalCount = (): void => this.updateResults(false);

	public updateResults = (
		clearResults: boolean = true,
		songWithIndex?: number,
		callback?: () => void,
	): void => {
		// Disable duplicate updates
		if (this.pauseNotifications) return;

		this.pauseNotifications = true;
		this.loading(true);

		if (clearResults) {
			this.page.removeAll();
			this.paging.page(1);
		}

		var pagingProperties = this.paging.getPagingProperties(clearResults);

		if (songWithIndex !== null && songWithIndex !== undefined) {
			pagingProperties.start = songWithIndex;
			pagingProperties.maxEntries = 1;
		}

		var services = this.pvPlayerViewModel.autoplay()
			? PVPlayerViewModel.autoplayPVServicesString
			: 'Youtube,SoundCloud,NicoNicoDouga,Bilibili,Vimeo,Piapro,File,LocalFile';

		this.songListRepo.getSongs(
			services,
			pagingProperties,
			SongOptionalFields.create(
				SongOptionalField.AdditionalNames,
				SongOptionalField.ThumbUrl,
			),
			this.vocaDbContext.languagePreference,
			(result: PartialFindResultContract<ISongForPlayList>) => {
				this.pauseNotifications = false;

				if (pagingProperties.getTotalCount)
					this.paging.totalItems(result.totalCount);

				_.each(result.items, (item) => {
					item.song.pvServicesArray = PVHelper.pvServicesArrayFromString(
						item.song.pvServices,
					);
					this.page.push(item);
				});

				this.loading(false);

				if (
					result.items &&
					result.items.length &&
					!this.pvPlayerViewModel.selectedSong()
				) {
					var song = this.pvPlayerViewModel.shuffle()
						? result.items[Math.floor(Math.random() * result.items.length)]
						: result.items[0];
					this.playSong(song);
				}

				if (callback) callback();
			},
		);
	};
}

export interface ISongForPlayList {
	// Song index in playlist with current filters, starting from 0.
	// In shuffle mode songs may be loaded out of order.
	indexInPlayList: number;

	name: string;

	song: SongApiContract;
}

export interface IPlayListRepository {
	getSongs(
		pvServices: string,
		paging: PagingProperties,
		fields: SongOptionalFields,
		lang: ContentLanguagePreference,
		callback: (result: PartialFindResultContract<ISongForPlayList>) => void,
	): void;
}
