import AlbumForEditContract from '@DataContracts/Album/AlbumForEditContract';
import ArtistContract from '@DataContracts/Artist/ArtistContract';
import ArtistForAlbumContract from '@DataContracts/ArtistForAlbumContract';
import ReleaseEventContract from '@DataContracts/ReleaseEvents/ReleaseEventContract';
import TranslatedEnumField from '@DataContracts/TranslatedEnumField';
import { ArtistAutoCompleteParams } from '@KnockoutExtensions/AutoCompleteParams';
import { SongAutoCompleteParams } from '@KnockoutExtensions/AutoCompleteParams';
import AlbumType from '@Models/Albums/AlbumType';
import EntryType from '@Models/EntryType';
import AlbumRepository from '@Repositories/AlbumRepository';
import ArtistRepository from '@Repositories/ArtistRepository';
import PVRepository from '@Repositories/PVRepository';
import ReleaseEventRepository from '@Repositories/ReleaseEventRepository';
import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import { IDialogService } from '@Shared/DialogService';
import UrlMapper from '@Shared/UrlMapper';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import $ from 'jquery';
import ko, {
	Computed,
	Observable,
	ObservableArray,
	ObservableExtenderOptions,
} from 'knockout';
import _ from 'lodash';
import moment from 'moment';

import { AlbumArtistRolesEditViewModel } from '../Artist/ArtistRolesEditViewModel';
import ArtistForAlbumEditViewModel from '../ArtistForAlbumEditViewModel';
import BasicEntryLinkViewModel from '../BasicEntryLinkViewModel';
import CustomNameEditViewModel from '../CustomNameEditViewModel';
import DeleteEntryViewModel from '../DeleteEntryViewModel';
import EntryPictureFileListEditViewModel from '../EntryPictureFileListEditViewModel';
import EnglishTranslatedStringEditViewModel from '../Globalization/EnglishTranslatedStringEditViewModel';
import NamesEditViewModel from '../Globalization/NamesEditViewModel';
import PVListEditViewModel from '../PVs/PVListEditViewModel';
import SongInAlbumEditViewModel from '../SongInAlbumEditViewModel';
import WebLinksEditViewModel from '../WebLinksEditViewModel';
import { AlbumDiscPropertiesListEditViewModel } from './AlbumDiscPropertiesEditViewModel';

// Edit view model for album.
export default class AlbumEditViewModel {
	// Adds a song to the album, by either id (existing song) or name (new song).
	public acceptTrackSelection: (
		songId?: number,
		songName?: string,
		itemType?: string,
	) => void;

	// Adds a new artist to the album
	// artistId: Id of the artist being added, if it's an existing artist. Can be null, if custom artist.
	// customArtistName: Name of the custom artist being added. Can be null, if existing artist.
	public addArtist = (artistId?: number, customArtistName?: string): void => {
		if (artistId) {
			this.artistRepository
				.getOne({ id: artistId, lang: this.vocaDbContext.languagePreference })
				.then((artist) => {
					var data: ArtistForAlbumContract = {
						artist: artist,
						isSupport: false,
						name: artist.name,
						id: 0,
						roles: 'Default',
					};

					var link = new ArtistForAlbumEditViewModel(this.repository, data);
					this.artistLinks.push(link);
				});
		} else {
			var data: ArtistForAlbumContract = {
				artist: null!,
				name: customArtistName,
				isSupport: false,
				id: 0,
				roles: 'Default',
			};

			var link = new ArtistForAlbumEditViewModel(this.repository, data);
			this.artistLinks.push(link);
		}
	};

	// Adds a list of artists (from the track properties view model) to selected tracks.
	public addArtistsToSelectedTracks: () => void;

	// Whether all tracks should be selected.
	public allTracksSelected: Observable<boolean>;

	private artistsForTracks: () => ArtistContract[];

	public artistSearchParams: ArtistAutoCompleteParams;

	// List of artist links for this album.
	public artistLinks: ObservableArray<ArtistForAlbumEditViewModel>;

	public artistRolesEditViewModel: AlbumArtistRolesEditViewModel;

	public catalogNumber: Observable<string>;

	public createNewIdentifier = (): void => {
		if (this.newIdentifier()) {
			this.identifiers.push(this.newIdentifier());
			this.newIdentifier('');
		}
	};

	public customizeName = (artistLink: ArtistForAlbumEditViewModel): void => {
		this.editedArtistLink.open(artistLink);
	};

	public defaultNameLanguage: Observable<string>;

	public deleteViewModel = new DeleteEntryViewModel((notes) => {
		$.ajax(
			this.urlMapper.mapRelative(
				'api/albums/' + this.id + '?notes=' + encodeURIComponent(notes),
			),
			{
				type: 'DELETE',
				success: () => {
					window.location.href = this.urlMapper.mapRelative(
						'/Album/Details/' + this.id,
					);
				},
			},
		);
	});

	public description: EnglishTranslatedStringEditViewModel;

	// Album disc type.
	public discType: Computed<AlbumType>;
	public discTypeStr: Observable<string>;

	public discs: AlbumDiscPropertiesListEditViewModel;

	public editArtistRoles = (artist: ArtistForAlbumEditViewModel): void => {
		this.artistRolesEditViewModel.show(artist);
	};

	public editedArtistLink = new CustomNameEditViewModel();

	// Begins editing properties for multiple tracks. Opens the properties dialog.
	public editMultipleTrackProperties: () => void;

	// Start editing properties for a single song. Opens the properties popup dialog.
	public editTrackProperties: (song: SongInAlbumEditViewModel) => void;

	// State for the song being edited in the properties dialog.
	public editedSong: Observable<TrackPropertiesViewModel | null>;

	public eventDate: Computed<moment.Moment>;

	// Gets an artist for album link view model by Id.
	public getArtistLink: (
		artistForAlbumId: number,
	) => ArtistForAlbumEditViewModel;

	public hasCover: boolean;

	public id: number;

	public identifiers: ObservableArray<string>;

	public names: NamesEditViewModel;

	public newIdentifier = ko.observable('');

	public releaseDate: Computed<moment.Moment>;

	public releaseDay: Observable<number>;

	public releaseEvent: BasicEntryLinkViewModel<ReleaseEventContract>;

	public releaseMonth: Observable<number>;

	public pictures: EntryPictureFileListEditViewModel;

	public pvs: PVListEditViewModel;

	public releaseYear: Observable<number>;

	// Removes an artist from this album.
	public removeArtist: (artist: ArtistForAlbumEditViewModel) => void;

	// Removes artists (selected from the track properties view model) from selected tracks.
	public removeArtistsFromSelectedTracks: () => void;

	// Removes a track from this album.
	public removeTrack: (song: SongInAlbumEditViewModel) => void;

	// Copies modified state from track properties view model to the single track being edited.
	public saveTrackProperties: () => void;

	public status: Observable<string>;

	public submit = (): boolean => {
		if (
			this.hasValidationErrors() &&
			this.status() !== 'Draft' &&
			this.dialogService.confirm(vdb.resources.entryEdit.saveWarning) === false
		) {
			return false;
		}

		this.submitting(true);

		var submittedModel: AlbumForEditContract = {
			artistLinks: _.map(this.artistLinks(), (artist) => artist.toContract()),
			defaultNameLanguage: this.defaultNameLanguage(),
			description: this.description.toContract(),
			discs: this.discs.toContracts(),
			discType: this.discTypeStr(),
			id: this.id,
			identifiers: this.identifiers(),
			names: this.names.toContracts(),
			originalRelease: {
				catNum: this.catalogNumber(),
				releaseDate: {
					day: this.releaseDay(),
					month: this.releaseMonth(),
					year: this.releaseYear(),
				},
				releaseEvent: this.releaseEvent.entry(),
			},
			pictures: this.pictures.toContracts(),
			pvs: this.pvs.toContracts(),
			songs: ko.toJS(this.tracks()),
			status: this.status(),
			updateNotes: this.updateNotes(),
			webLinks: this.webLinks.toContracts(),
		};

		this.submittedJson(ko.toJSON(submittedModel));

		return true;
	};

	public submittedJson = ko.observable('');
	public submitting = ko.observable(false);

	// Buttons for the track properties dialog.
	public trackPropertiesDialogButtons: ObservableArray<any>;

	// Whether the track properties dialog should be visible.
	public trackPropertiesDialogVisible: Observable<boolean>;

	// List of tracks for this album.
	public tracks: ObservableArray<SongInAlbumEditViewModel>;

	// Search parameters for new tracks.
	public trackSearchParams: SongAutoCompleteParams;

	// Gets a translated name for an artist role.
	public translateArtistRole: (role: string) => string;

	public updateNotes = ko.observable('');

	// Updates track and disc numbers of all tracks for this album. This should be done every time the order changes, or tracks are added or removed.
	private updateTrackNumbers: () => void;

	// List of external links for this album.
	public webLinks: WebLinksEditViewModel;

	public hasValidationErrors: Computed<boolean>;
	public validationExpanded = ko.observable(false);
	public validationError_duplicateArtist: Computed<boolean>;
	public validationError_needArtist: Computed<boolean>;
	public validationError_needCover: Computed<boolean>;
	public validationError_needReferences: Computed<boolean>;
	public validationError_needReleaseYear: Computed<boolean>;
	public validationError_needTracks: Computed<boolean>;
	public validationError_needType: Computed<boolean>;
	public validationError_unspecifiedNames: Computed<boolean>;

	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		public repository: AlbumRepository,
		songRepository: SongRepository,
		private artistRepository: ArtistRepository,
		pvRepository: PVRepository,
		userRepository: UserRepository,
		eventRepository: ReleaseEventRepository,
		private urlMapper: UrlMapper,
		artistRoleNames: { [key: string]: string },
		webLinkCategories: TranslatedEnumField[],
		data: AlbumForEditContract,
		allowCustomTracks: boolean,
		canBulkDeletePVs: boolean,
		private dialogService: IDialogService,
	) {
		this.catalogNumber = ko.observable(data.originalRelease.catNum);
		this.defaultNameLanguage = ko.observable(data.defaultNameLanguage);
		this.description = new EnglishTranslatedStringEditViewModel(
			data.description,
		);
		this.discTypeStr = ko.observable(data.discType);
		this.discType = ko.computed(
			() => AlbumType[this.discTypeStr() as keyof typeof AlbumType],
		);
		this.id = data.id;
		this.pvs = new PVListEditViewModel(
			pvRepository,
			urlMapper,
			data.pvs,
			canBulkDeletePVs,
			true,
			false,
		);
		this.releaseDay = ko
			.observable(data.originalRelease.releaseDate.day!)
			.extend({ parseInteger: {} } as ObservableExtenderOptions<number>);
		this.releaseMonth = ko
			.observable(data.originalRelease.releaseDate.month!)
			.extend({ parseInteger: {} } as ObservableExtenderOptions<number>);
		this.releaseYear = ko
			.observable(data.originalRelease.releaseDate.year!)
			.extend({ parseInteger: {} } as ObservableExtenderOptions<number>);
		this.releaseEvent = new BasicEntryLinkViewModel<ReleaseEventContract>(
			data.originalRelease.releaseEvent,
			null!,
		);
		this.status = ko.observable(data.status);

		this.artistSearchParams = {
			createNewItem: vdb.resources.albumEdit.addExtraArtist,
			acceptSelection: this.addArtist,
			height: 300,
		};

		this.acceptTrackSelection = (
			songId?: number,
			songName?: string,
			itemType?: string,
		): void => {
			if (songId) {
				songRepository
					.getOneWithComponents({
						id: songId,
						fields: 'AdditionalNames,Artists',
						lang: vocaDbContext.languagePreference,
					})
					.then((song) => {
						var artists = _.filter(
							_.map(song.artists!, (artistLink) => artistLink.artist),
							(artist) => artist != null,
						);

						var track = new SongInAlbumEditViewModel({
							artists: artists,
							artistString: song.artistString,
							songAdditionalNames: song.additionalNames,
							songId: song.id,
							songName: song.name,
							discNumber: 1,
							songInAlbumId: 0,
							trackNumber: 1,
						});
						track.isNextDisc.subscribe(() => this.updateTrackNumbers());
						this.tracks.push(track);
					});
			} else {
				var track = new SongInAlbumEditViewModel({
					songName: songName!,
					artists: [],
					artistString: '',
					discNumber: 1,
					songAdditionalNames: '',
					songId: 0,
					songInAlbumId: 0,
					trackNumber: 1,
					isCustomTrack: itemType === 'custom',
				});
				track.isNextDisc.subscribe(() => this.updateTrackNumbers());
				this.tracks.push(track);
			}
		};

		this.addArtistsToSelectedTracks = (): void => {
			_.forEach(
				_.filter(this.tracks(), (s) => s.selected()),
				(song) => {
					var added = _.map(
						_.filter(
							this.editedSong()!.artistSelections,
							(a) =>
								a.selected() &&
								_.every(song.artists(), (a2) => a.artist.id !== a2.id),
						),
						(a3) => a3.artist,
					);
					song.artists.push.apply(song.artists, added);
				},
			);

			this.trackPropertiesDialogVisible(false);
		};

		this.allTracksSelected = ko.observable(false);

		this.allTracksSelected.subscribe((selected) => {
			_.forEach(this.tracks(), (s) => {
				if (!s.isCustomTrack) s.selected(selected);
			});
		});

		this.artistsForTracks = (): ArtistContract[] => {
			var notAllowedTypes = ['Label'];
			return _.map(
				_.filter(
					this.artistLinks(),
					(a) =>
						a.artist != null &&
						!_.includes(notAllowedTypes, a.artist.artistType),
				),
				(a) => a.artist,
			);
		};

		this.artistLinks = ko.observableArray(
			_.map(
				data.artistLinks,
				(artist) => new ArtistForAlbumEditViewModel(repository, artist),
			),
		);

		this.artistRolesEditViewModel = new AlbumArtistRolesEditViewModel(
			artistRoleNames,
		);

		this.discs = new AlbumDiscPropertiesListEditViewModel(data.discs);

		this.editMultipleTrackProperties = (): void => {
			var artists = this.artistsForTracks();
			this.editedSong(new TrackPropertiesViewModel(artists, null!));
			this.trackPropertiesDialogButtons([
				{ text: 'Add to tracks', click: this.addArtistsToSelectedTracks },
				{
					text: 'Remove from tracks',
					click: this.removeArtistsFromSelectedTracks,
				},
			]);
			this.trackPropertiesDialogVisible(true);
		};

		this.editTrackProperties = (song): void => {
			var artists = this.artistsForTracks();
			this.editedSong(new TrackPropertiesViewModel(artists, song));
			this.trackPropertiesDialogButtons([
				{ text: 'Save', click: this.saveTrackProperties },
			]);
			this.trackPropertiesDialogVisible(true);
		};

		this.editedSong = ko.observable(null!);

		this.getArtistLink = (artistForAlbumId): ArtistForAlbumEditViewModel => {
			return _.find(
				this.artistLinks(),
				(artist) => artist.id === artistForAlbumId,
			)!;
		};

		this.hasCover = data.coverPictureMime != null;

		this.identifiers = ko.observableArray(data.identifiers);

		this.names = NamesEditViewModel.fromContracts(data.names);

		this.pictures = new EntryPictureFileListEditViewModel(data.pictures);

		this.removeArtist = (artistForAlbum): void => {
			this.artistLinks.remove(artistForAlbum);
		};

		this.removeArtistsFromSelectedTracks = (): void => {
			_.forEach(
				_.filter(this.tracks(), (s) => s.selected()),
				(song) => {
					var removed = _.filter(song.artists(), (a) =>
						_.some(
							this.editedSong()!.artistSelections,
							(a2) => a2.selected() && a.id === a2.artist.id,
						),
					);
					song.artists.removeAll(removed);
				},
			);

			this.trackPropertiesDialogVisible(false);
		};

		this.removeTrack = (song): void => {
			this.tracks.remove(song);
		};

		this.saveTrackProperties = (): void => {
			this.trackPropertiesDialogVisible(false);

			if (this.editedSong) {
				var selected = _.map(
					_.filter(this.editedSong()!.artistSelections, (a) => a.selected()),
					(a) => a.artist,
				);
				this.editedSong()!.song.artists(selected);
				this.editedSong(null!);
			}
		};

		this.trackPropertiesDialogButtons = ko.observableArray([
			{ text: 'Save', click: this.saveTrackProperties },
		]);

		this.trackPropertiesDialogVisible = ko.observable(false);

		this.tracks = ko.observableArray(
			_.map(data.songs, (song) => new SongInAlbumEditViewModel(song)),
		);

		_.forEach(this.tracks(), (song) => {
			song.isNextDisc.subscribe(() => this.updateTrackNumbers());
		});

		this.tracks.subscribe(() => this.updateTrackNumbers());

		var songTypes =
			'Unspecified,Original,Remaster,Remix,Cover,Arrangement,Mashup,Other,Instrumental,Live,Illustration';

		if (data.discType === 'Video') songTypes += ',MusicPV,DramaPV';

		this.trackSearchParams = {
			acceptSelection: this.acceptTrackSelection,
			createNewItem: "Create new song named '{0}'.", // TODO: localize
			createCustomItem: allowCustomTracks
				? "Create custom track named '{0}'"
				: null!,
			extraQueryParams: { songTypes: songTypes },
		};

		this.translateArtistRole = (role): string => {
			return artistRoleNames[role];
		};

		this.updateTrackNumbers = (): void => {
			var track = 1;
			var disc = 1;

			_.forEach(this.tracks(), (song) => {
				if (song.isNextDisc()) {
					disc++;
					track = 1;
				}

				song.discNumber(disc);
				song.trackNumber(track);
				track++;
			});
		};

		this.webLinks = new WebLinksEditViewModel(data.webLinks, webLinkCategories);

		this.validationError_duplicateArtist = ko.computed(() => {
			return _.some(
				_.groupBy(
					this.artistLinks(),
					(a) => (a.artist ? a.artist.id.toString() : a.name()) + a.isSupport(),
				),
				(a) => a.length > 1,
			);
		});

		this.validationError_needArtist = ko.computed(() =>
			_.isEmpty(this.artistLinks()),
		);
		this.validationError_needCover = ko.computed(() => !this.hasCover);

		this.validationError_needReferences = ko.computed(
			() =>
				_.isEmpty(this.description.original()) &&
				_.isEmpty(this.webLinks.items()) &&
				_.isEmpty(this.pvs.pvs()),
		);

		this.validationError_needReleaseYear = ko.computed(() => {
			var num = !_.isNumber(this.releaseYear()) || this.releaseYear() == null;
			return num;
		});
		this.validationError_needTracks = ko.computed(
			() => this.discType() !== AlbumType.Artbook && _.isEmpty(this.tracks()),
		);
		this.validationError_needType = ko.computed(
			() => this.discType() === AlbumType.Unknown,
		);
		this.validationError_unspecifiedNames = ko.computed(
			() => !this.names.hasPrimaryName(),
		);

		this.hasValidationErrors = ko.computed(
			() =>
				this.validationError_duplicateArtist() ||
				this.validationError_needArtist() ||
				this.validationError_needCover() ||
				this.validationError_needReferences() ||
				this.validationError_needReleaseYear() ||
				this.validationError_needTracks() ||
				this.validationError_needType() ||
				this.validationError_unspecifiedNames(),
		);

		this.eventDate = ko.computed(() =>
			this.releaseEvent.entry() && this.releaseEvent.entry().date
				? moment(this.releaseEvent.entry().date!)
				: null!,
		);

		this.releaseDate = ko.computed({
			read: () => {
				return this.releaseYear() && this.releaseMonth() && this.releaseDay()
					? moment([this.releaseYear(), this.releaseMonth(), this.releaseDay()])
					: null!;
			},
			write: (val: moment.Moment) => {
				this.releaseYear(val.year());
				this.releaseMonth(val.month() + 1);
				this.releaseDay(val.date());
			},
		});

		window.setInterval(
			() =>
				userRepository.refreshEntryEdit({
					entryType: EntryType.Album,
					entryId: data.id,
				}),
			10000,
		);
	}
}

// Single artist selection for the track properties dialog.
export class TrackArtistSelectionViewModel {
	// Whether this artist has been selected.
	public selected: Observable<boolean>;

	// Whether this selection is visible according to current filter.
	public visible: Computed<boolean>;

	public constructor(
		public artist: ArtistContract,
		selected: boolean,
		filter: Observable<string>,
	) {
		this.selected = ko.observable(selected);

		this.visible = ko.computed(() => {
			var f = filter();
			if (f.length === 0) return true;

			f = f.trim().toLowerCase();

			return (
				artist.name.toLowerCase().indexOf(f) >= 0 ||
				artist.additionalNames!.toLowerCase().indexOf(f) >= 0
			);
		});
	}
}

// View model for the track properties dialog, for editing artists for one or more tracks.
export class TrackPropertiesViewModel {
	// Selectable artists.
	public artistSelections: TrackArtistSelectionViewModel[];

	// Artist filter string.
	public filter: Observable<string> = ko.observable('');

	// At least one artist selected for this track.
	public somethingSelected: Computed<boolean>;

	// At least one artist selectable (not selected and visible).
	public somethingSelectable: Computed<boolean>;

	public constructor(
		artists: ArtistContract[],
		public song: SongInAlbumEditViewModel,
	) {
		this.artistSelections = _.map(
			artists,
			(a) =>
				new TrackArtistSelectionViewModel(
					a,
					song != null && _.some(song.artists(), (sa) => a.id === sa.id),
					this.filter,
				),
		);

		this.somethingSelected = ko.computed(() => {
			return _.some(this.artistSelections, (a) => a.selected());
		});

		this.somethingSelectable = ko.computed(() => {
			return _.some(this.artistSelections, (a) => !a.selected() && a.visible());
		});
	}
}
