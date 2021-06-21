import SongApiContract from '@DataContracts/Song/SongApiContract';
import PVService from '@Models/PVs/PVService';
import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import ui from '@Shared/MessagesTyped';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Observable } from 'knockout';
import _ from 'lodash';

import PVRatingButtonsViewModel from '../PVRatingButtonsViewModel';
import PVPlayersFactory from './PVPlayersFactory';

export default class PVPlayerViewModel {
	public static autoplayPVServicesString =
		'File, LocalFile, NicoNicoDouga, SoundCloud, Youtube';

	public constructor(
		vocaDbContext: VocaDbContext,
		private urlMapper: UrlMapper,
		private songRepo: SongRepository,
		userRepo: UserRepository,
		pvPlayersFactory: PVPlayersFactory,
		autoplay?: boolean,
		shuffle?: boolean,
	) {
		if (autoplay !== null && autoplay !== undefined) this.autoplay(autoplay);

		if (shuffle !== null && shuffle !== undefined) this.shuffle(shuffle);

		this.players = pvPlayersFactory.createPlayers(this.songFinishedPlayback);

		this.selectedSong.subscribe((song) => {
			if (song == null) {
				if (this.currentPlayer) {
					this.currentPlayer.detach();
					this.currentPlayer = null!;
				}

				this.playerHtml('');
				this.ratingButtonsViewModel(null!);
				return;
			}

			userRepo
				.getSongRating({
					userId: vocaDbContext.loggedUserId,
					songId: song.song.id,
				})
				.then((rating) => {
					this.ratingButtonsViewModel(
						new PVRatingButtonsViewModel(
							userRepo,
							{ id: song.song.id, vote: rating },
							ui.showThankYouForRatingMessage,
						),
					);
				});

			// Use current player
			if (
				this.currentPlayer &&
				this.songHasPVService(song, this.currentPlayer.service)
			) {
				this.loadPVId(
					this.currentPlayer.service,
					song.song.id,
					this.currentPlayer.play,
				);
			} else {
				// Detech old player
				if (this.currentPlayer) {
					this.currentPlayer.detach();
					this.currentPlayer = null!;
				}

				var services = this.autoplay()
					? PVPlayerViewModel.autoplayPVServicesString
					: null;

				// Load new player from server and attach it
				songRepo
					.pvPlayer({
						songId: song.song.id,
						params: {
							elementId: pvPlayersFactory.playerElementId,
							enableScriptAccess: true,
							pvServices: services!,
						},
					})
					.then((result) => {
						this.playerHtml(result.playerHtml);
						this.playerService =
							PVService[result.pvService as keyof typeof PVService];
						this.currentPlayer = this.players[result.pvService];

						if (this.currentPlayer) {
							this.currentPlayer.attach(false, () => {
								this.currentPlayer.play();
							});
						}
					});
			}
		});

		this.autoplay.subscribe((autoplay) => {
			if (autoplay) {
				/* 
						3 cases: 
						1) currently playing PV supports autoplay: no need to do anything (already attached)
						2) currently playing song has PV that supports autoplay with another player: switch player
						3) currently playing song doesn't have a PV that supports autoplay: switch song
					*/

				// Case 1
				if (this.currentPlayer) {
					return;
				}

				// Case 2
				var newService = _.find(this.autoplayServices, (s) =>
					this.songHasPVService(this.selectedSong()!, s),
				);
				if (newService) {
					this.playerService = newService;
					this.currentPlayer = this.players[PVService[newService]];
					this.currentPlayer.attach(true, () => {
						this.loadPVId(
							this.currentPlayer.service,
							this.selectedSong()!.song.id,
							this.currentPlayer.play,
						);
					});
					return;
				}

				// Case 3
				if (this.resetSong) this.resetSong();
			}
		});
	}

	public autoplay = ko.observable(false);
	private autoplayServices = [
		PVService.File,
		PVService.Youtube,
		PVService.SoundCloud,
	];
	private currentPlayer: IPVPlayer = null!;

	private loadPVId = (
		service: PVService,
		songId: number,
		callback: (pvId: string) => void,
	): void => {
		this.songRepo
			.getPvId({ songId: songId, pvService: service })
			.then(callback);
	};

	private players: { [index: string]: IPVPlayer };
	public nextSong!: () => void;
	public playerHtml = ko.observable<string>(null!);
	public playerService: PVService = null!;
	public ratingButtonsViewModel: Observable<PVRatingButtonsViewModel | null> = ko.observable(
		null!,
	);
	public resetSong: () => void = null!;
	public selectedSong = ko.observable<IPVPlayerSong>(null!);
	private static serviceName = (service: PVService): string =>
		PVService[service];
	public shuffle = ko.observable(false);

	private songFinishedPlayback = (): void => {
		if (this.autoplay() && this.nextSong) this.nextSong();
	};

	private songHasPVService = (
		song: IPVPlayerSong,
		service: PVService,
	): boolean => {
		return _.includes(song.song.pvServicesArray!, service);
	};

	public songIsValid = (song: IPVPlayerSong): boolean => {
		return (
			!this.autoplay() ||
			this.autoplayServices.some((s) =>
				_.includes(song.song.pvServicesArray!, s),
			)
		);
	};
}

export interface IPVPlayerSong {
	song: SongApiContract;
}

export interface IPVPlayer {
	// Attach the player by creating the JavaScript object, either to the currently playing element, or create a new element.
	// reset: whether to create a new player element
	// readyCallback: called when the player is ready
	attach: (reset?: boolean, readyCallback?: () => void) => void;

	detach: () => void;

	// Called when the currently playing song has finished playing. This will only be called if the player was attached.
	songFinishedCallback?: () => void;

	// Start playing the video.
	// pvId: ID of the PV being played. Note: this can be undefined, in which case the player should be attached and started playback without loading a new PV.
	play: (pvId?: string) => void;
	service: PVService;
}
