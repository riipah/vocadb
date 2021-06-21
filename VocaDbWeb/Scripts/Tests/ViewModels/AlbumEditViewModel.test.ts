import AlbumForEditContract from '@DataContracts/Album/AlbumForEditContract';
import ArtistContract from '@DataContracts/Artist/ArtistContract';
import SongApiContract from '@DataContracts/Song/SongApiContract';
import SongInAlbumEditContract from '@DataContracts/Song/SongInAlbumEditContract';
import TranslatedEnumField from '@DataContracts/TranslatedEnumField';
import UrlMapper from '@Shared/UrlMapper';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import AlbumEditViewModel, {
	TrackArtistSelectionViewModel,
} from '@ViewModels/Album/AlbumEditViewModel';
import { TrackPropertiesViewModel } from '@ViewModels/Album/AlbumEditViewModel';
import SongInAlbumEditViewModel from '@ViewModels/SongInAlbumEditViewModel';
import _ from 'lodash';

import FakeAlbumRepository from '../TestSupport/FakeAlbumRepository';
import FakeArtistRepository from '../TestSupport/FakeArtistRepository';
import FakeSongRepository from '../TestSupport/FakeSongRepository';
import FakeUserRepository from '../TestSupport/FakeUserRepository';

const vocaDbContext = container.get(VocaDbContext);

var rep = new FakeAlbumRepository();
var songRep: FakeSongRepository;
var artistRep: FakeArtistRepository;
var userRepo = new FakeUserRepository();
var pvRep: any = null;
var urlMapper = new UrlMapper('');

var song: SongApiContract;
var categories: TranslatedEnumField[] = [
	{ id: 'Official', name: 'Official' },
	{ id: 'Commercial', name: 'Commercial' },
];

var producer: ArtistContract = {
	id: 1,
	name: 'Tripshots',
	additionalNames: '',
	artistType: 'Producer',
};
var vocalist: ArtistContract = {
	id: 2,
	name: 'Hatsune Miku',
	additionalNames: '初音ミク',
	artistType: 'Vocalist',
};
var label: ArtistContract = {
	id: 3,
	name: 'KarenT',
	additionalNames: '',
	artistType: 'Label',
};

var producerArtistLink = {
	artist: producer,
	id: 39,
	isSupport: false,
	name: '',
	roles: 'Default',
};
var vocalistArtistLink = {
	artist: vocalist,
	id: 40,
	isSupport: false,
	name: '',
	roles: 'Default',
};
var labelArtistLink = {
	artist: label,
	id: 41,
	isSupport: false,
	name: '',
	roles: 'Default',
};
var customArtistLink: any = {
	artist: null,
	id: 42,
	isSupport: false,
	name: 'xxJulexx',
	roles: 'Default',
};

var songInAlbum: SongInAlbumEditContract;
var customTrack: SongInAlbumEditContract;
var roles: { [key: string]: string } = {
	Default: 'Default',
	VoiceManipulator: 'Voice manipulator',
};
var webLinkData = {
	category: 'Official',
	description: 'Youtube Channel',
	id: 123,
	url: 'http://www.youtube.com/user/tripshots',
	disabled: false,
};
var data: AlbumForEditContract;
vdb.resources = {
	album: {},
	albumDetails: { download: '' },
	albumEdit: { addExtraArtist: '' },
	entryEdit: {},
	shared: null,
	song: null,
};

beforeEach(() => {
	songRep = new FakeSongRepository();
	song = {
		additionalNames: '',
		artistString: 'Tripshots',
		artists: [
			{
				id: 0,
				artist: producer,
				isSupport: false,
				name: null!,
				roles: null!,
			},
		],
		id: 2,
		lengthSeconds: 0,
		name: 'Anger',
		pvServices: 'Nothing',
		ratingScore: 0,
		songType: 'Original',
		createDate: null!,
		status: 'Finished',
	};
	songRep.song = song;

	artistRep = new FakeArtistRepository();

	songInAlbum = {
		artists: [producer],
		artistString: 'Tripshots',
		discNumber: 1,
		songAdditionalNames: '',
		songId: 3,
		songInAlbumId: 1,
		songName: 'Nebula',
		trackNumber: 1,
	};

	customTrack = {
		artists: [],
		artistString: '',
		discNumber: 1,
		songAdditionalNames: '',
		songId: 0,
		songInAlbumId: 2,
		songName: 'Bonus Track',
		trackNumber: 2,
		isCustomTrack: true,
	};

	data = {
		artistLinks: [
			producerArtistLink,
			vocalistArtistLink,
			labelArtistLink,
			customArtistLink,
		],
		coverPictureMime: 'image/jpeg',
		defaultNameLanguage: 'English',
		description: {
			original: '',
			english: '',
		},
		discType: 'Album',
		discs: [],
		id: 0,
		identifiers: [],
		names: [],
		originalRelease: {
			catNum: '',
			releaseEvent: null!,
			releaseDate: {},
		},
		pictures: [],
		pvs: [],
		songs: [songInAlbum, customTrack],
		status: 'Draft',
		webLinks: [webLinkData],
	};
});

function createViewModel(): AlbumEditViewModel {
	return new AlbumEditViewModel(
		vocaDbContext,
		rep,
		songRep,
		artistRep,
		pvRep,
		userRepo,
		null!,
		urlMapper,
		roles,
		categories,
		data,
		true,
		false,
		null!,
	);
}

function createTrackPropertiesViewModel(): TrackPropertiesViewModel {
	var songVm = new SongInAlbumEditViewModel(songInAlbum);
	return new TrackPropertiesViewModel([producer, vocalist], songVm);
}

function findArtistSelection(
	target: TrackPropertiesViewModel,
	artist: ArtistContract,
): TrackArtistSelectionViewModel {
	return _.find(target.artistSelections, (a) => a.artist === artist)!;
}

test('constructor', () => {
	var target = createViewModel();

	expect(target.artistLinks().length, 'artistLinks.length').toBe(4);
	expect(target.artistLinks()[0].id, 'artistLinks[0].id').toBe(39);
	expect(target.artistLinks()[0].artist, 'artistLinks[0].artist').toBeTruthy();
	expect(target.artistLinks()[0].artist, 'artistLinks[0].artist').toBe(
		producer,
	);

	expect(target.tracks().length, 'tracks.length').toBe(2);
	expect(target.tracks()[0].songId, 'tracks[0].songId').toBe(3);
	expect(target.tracks()[0].songName, 'tracks[0].songName').toBe('Nebula');
	expect(target.tracks()[0].selected(), 'tracks[0].selected').toBe(false);
	expect(target.tracks()[0].trackNumber(), 'tracks[0].trackNumber').toBe(1);

	expect(target.webLinks.items().length, 'webLinks.length').toBe(1);
	expect(target.webLinks.items()[0].id, 'webLinks[0].id').toBe(123);
});

test('acceptTrackSelection existing', () => {
	var target = createViewModel();
	target.tracks.removeAll();

	target.acceptTrackSelection(2, null!);

	expect(target.tracks().length, 'tracks.length').toBe(1);
	expect(target.tracks()[0].songId, 'tracks[0].songId').toBe(2);
	expect(target.tracks()[0].songName, 'tracks[0].songName').toBe('Anger');
});

test('acceptTrackSelection new', () => {
	var target = createViewModel();
	target.tracks.removeAll();

	target.acceptTrackSelection(null!, 'Anger RMX');

	expect(target.tracks().length, 'tracks.length').toBe(1);
	expect(target.tracks()[0].songId, 'tracks[0].songId').toBe(0);
	expect(target.tracks()[0].songName, 'tracks[0].songName').toBe('Anger RMX');
});

test('acceptTrackSelection add a second track', () => {
	var target = createViewModel();

	target.acceptTrackSelection(2, null!);

	expect(target.tracks().length, 'tracks.length').toBe(3);
	expect(_.last(target.tracks())!.trackNumber(), 'tracks[2].trackNumber').toBe(
		3,
	);
});

test('addArtist existing', () => {
	var newVocalist: ArtistContract = {
		id: 4,
		name: 'Kagamine Rin',
		additionalNames: '',
		artistType: 'Vocaloid',
	};
	artistRep.result = newVocalist;

	var target = createViewModel();
	target.addArtist(4);

	expect(target.artistLinks().length, 'artistLinks().length').toBe(5);
	expect(
		_.some(target.artistLinks(), (a) => a.artist === newVocalist),
		'New vocalist was added',
	).toBe(true);
});

test('addArtist custom', () => {
	var target = createViewModel();
	target.addArtist(null!, 'Custom artist');

	expect(target.artistLinks().length, 'artistLinks().length').toBe(5);
	expect(
		_.some(target.artistLinks(), (a) => a.name() === 'Custom artist'),
		'Custom artist was added',
	).toBe(true);
});

test('allTracksSelected', () => {
	var target = createViewModel();

	target.allTracksSelected(true);

	expect(target.tracks()[0].selected(), 'tracks[0].selected').toBe(true);
	expect(target.tracks()[1].selected(), 'tracks[1].selected').toBe(false); // Custom tracks won't be selected
});

test('editTrackProperties', () => {
	var target = createViewModel();
	var track = target.tracks()[0];

	target.editTrackProperties(track);
	var edited = target.editedSong()!;

	expect(edited, 'editedSong').toBeTruthy();
	expect(edited.song, 'editedSong.song').toBe(track);
	expect(edited.artistSelections, 'editedSong.artistSelections').toBeTruthy();
	expect(
		edited.artistSelections.length,
		'editedSong.artistSelections.length',
	).toBe(2); // Label or custom artist are not included.
	expect(
		edited.artistSelections[0].artist,
		'editedSong.artistSelections[0].artist',
	).toBe(producer);
	expect(
		edited.artistSelections[0].selected(),
		'editedSong.artistSelections[0].selected',
	).toBe(true); // Selected, because added to song
	expect(
		edited.artistSelections[0].visible(),
		'artistSelections[0].visible',
	).toBe(true); // No filter
	expect(
		edited.artistSelections[1].artist,
		'editedSong.artistSelections[1].artist',
	).toBe(vocalist);
	expect(
		edited.artistSelections[1].selected(),
		'editedSong.artistSelections[1].selected',
	).toBe(false); // Not seleted, because not added yet
	expect(
		edited.artistSelections[1].visible(),
		'artistSelections[1].visible',
	).toBe(true); // No filter
});

test('saveTrackProperties not changed', () => {
	var target = createViewModel();
	var track = target.tracks()[0];
	target.editTrackProperties(track);

	target.saveTrackProperties();

	expect(track.artists().length, 'track.artists.length').toBe(1);
	expect(track.artists()[0], 'track.artists[0]').toBe(producer);
});

test('saveTrackProperties changed', () => {
	var target = createViewModel();
	var track = target.tracks()[0];
	target.editTrackProperties(track);
	target.editedSong()!.artistSelections[0].selected(false);

	target.saveTrackProperties();

	expect(track.artists().length, 'track.artists.length').toBe(0);
});

test('filter displayName', () => {
	var target = createViewModel();
	var track = target.tracks()[0];
	target.editTrackProperties(track);
	var edited = target.editedSong()!;

	edited.filter('tri');

	expect(
		edited.artistSelections[0].visible(),
		'artistSelections[0].visible',
	).toBe(true); // Producer (Tripshots)
	expect(
		edited.artistSelections[1].visible(),
		'artistSelections[1].visible',
	).toBe(false); // Vocalist (Hatsune Miku)
});

test('filter additionalName', () => {
	var target = createViewModel();
	var track = target.tracks()[0];
	target.editTrackProperties(track);
	var edited = target.editedSong()!;

	edited.filter('初音ミク');

	expect(
		edited.artistSelections[0].visible(),
		'artistSelections[0].visible',
	).toBe(false); // Producer (Tripshots)
	expect(
		edited.artistSelections[1].visible(),
		'artistSelections[1].visible',
	).toBe(true); // Vocalist (Hatsune Miku)
});

test('editMultipleTrackProperties', () => {
	var target = createViewModel();

	target.editMultipleTrackProperties();

	expect(target.editedSong(), 'editedSong').toBeTruthy();
	expect(
		target.editedSong()!.artistSelections,
		'editedSong.artistSelections',
	).toBeTruthy();
	expect(
		target.editedSong()!.artistSelections.length,
		'editedSong.artistSelections.length',
	).toBe(2); // Label or custom artist are not included.
	expect(
		target.editedSong()!.artistSelections[0].selected(),
		'editedSong.artistSelections[0].selected',
	).toBe(false);
	expect(
		target.editedSong()!.artistSelections[1].selected(),
		'editedSong.artistSelections[1].selected',
	).toBe(false);
});

// Add an artist to a track that was not added before
test('addArtistsToSelectedTracks add new artists', () => {
	var target = createViewModel();
	var track = target.tracks()[0];
	track.selected(true);
	target.editMultipleTrackProperties();
	target.editedSong()!.artistSelections[1].selected(true); // Select vocalist, which is not added yet

	target.addArtistsToSelectedTracks();

	expect(track.artists().length, 'target.tracks[0].artists.length').toBe(2);
	expect(track.artists()[0], 'target.tracks[0].artists[0]').toBe(producer);
	expect(track.artists()[1], 'target.tracks[0].artists[1]').toBe(vocalist);
});

test('addArtistsToSelectedTracks not changed', () => {
	var target = createViewModel();
	var track = target.tracks()[0];
	track.selected(true);
	target.editMultipleTrackProperties();
	target.editedSong()!.artistSelections[0].selected(true); // Select producer, who is added already

	target.addArtistsToSelectedTracks();

	expect(track.artists().length, 'target.tracks[0].artists.length').toBe(1);
	expect(track.artists()[0], 'target.tracks[0].artists[0]').toBe(producer);
});

test('removeArtistsFromSelectedTracks remove artist', () => {
	var target = createViewModel();
	var track = target.tracks()[0];
	track.selected(true);
	target.editMultipleTrackProperties();
	target.editedSong()!.artistSelections[0].selected(true); // Select producer, who is added already

	target.removeArtistsFromSelectedTracks();

	expect(track.artists().length, 'target.tracks[0].artists.length').toBe(0);
});

test('removeArtistsFromSelectedTracks not changed', () => {
	var target = createViewModel();
	var track = target.tracks()[0];
	track.selected(true);
	target.editMultipleTrackProperties();
	target.editedSong()!.artistSelections[1].selected(true); // Select vocalist, who isn't added

	target.removeArtistsFromSelectedTracks();

	expect(track.artists().length, 'target.tracks[0].artists.length').toBe(1);
	expect(track.artists()[0], 'target.tracks[0].artists[0]').toBe(producer);
});

test('getArtistLink found', () => {
	var target = createViewModel();

	var result = target.getArtistLink(39);

	expect(result, 'result').toBeTruthy();
	expect(result.id, 'result.id').toBe(39);
});

test('getArtistLink not found', () => {
	var target = createViewModel();

	var result = target.getArtistLink(123);

	expect(!result, 'result').toBeTruthy();
});

test('translateArtistRole', () => {
	var target = createViewModel();

	var result = target.translateArtistRole('VoiceManipulator');

	expect(result, 'result').toBe('Voice manipulator');
});

test('updateTrackNumbers updated by setting isNextDisc', () => {
	var target = createViewModel();
	target.acceptTrackSelection(3, null!); // Adds a new track
	target.tracks()[0].isNextDisc(true);

	expect(target.tracks()[0].discNumber(), 'tracks[0].discNumber').toBe(2);
	expect(target.tracks()[0].trackNumber(), 'tracks[0].trackNumber').toBe(1);
	expect(target.tracks()[1].trackNumber(), 'tracks[1].trackNumber').toBe(2);
	expect(target.tracks()[2].trackNumber(), 'tracks[2].trackNumber').toBe(3);
});

test('TrackPropertiesViewModel constructor', () => {
	var target = createTrackPropertiesViewModel();

	expect(target.artistSelections, 'artistSelections').toBeTruthy();
	expect(target.somethingSelected(), 'somethingSelected').toBe(true);
	expect(target.somethingSelectable(), 'somethingSelectable').toBe(true);
	expect(target.artistSelections.length, 'artistSelections.length').toBe(2);

	var producerSelection = findArtistSelection(target, producer);
	expect(producerSelection, 'producerSelection').toBeTruthy();
	expect(producerSelection.selected(), 'producerSelection.selected').toBe(true);
	expect(producerSelection.visible(), 'producerSelection.visible').toBe(true);

	var vocalistSelection = findArtistSelection(target, vocalist);
	expect(vocalistSelection, 'vocalistSelection').toBeTruthy();
	expect(vocalistSelection.selected(), 'vocalistSelection.selected').toBe(
		false,
	);
	expect(vocalistSelection.visible(), 'vocalistSelection.visible').toBe(true);
});

test('TrackPropertiesViewModel filter matches artist', () => {
	var target = createTrackPropertiesViewModel();

	target.filter('miku');

	var vocalistSelection = findArtistSelection(target, vocalist);
	expect(vocalistSelection.visible(), 'vocalistSelection.visible').toBe(true);
});

test('TrackPropertiesViewModel filter does not match artist', () => {
	var target = createTrackPropertiesViewModel();

	target.filter('luka');

	var vocalistSelection = findArtistSelection(target, vocalist);
	expect(vocalistSelection.visible(), 'vocalistSelection.visible').toBe(false);
});
