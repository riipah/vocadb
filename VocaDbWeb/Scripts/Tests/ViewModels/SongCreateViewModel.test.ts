import ArtistContract from '@DataContracts/Artist/ArtistContract';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import SongCreateViewModel from '@ViewModels/SongCreateViewModel';

import FakeArtistRepository from '../TestSupport/FakeArtistRepository';
import FakeSongRepository from '../TestSupport/FakeSongRepository';
import FakeTagRepository from '../TestSupport/FakeTagRepository';

const vocaDbContext = container.get(VocaDbContext);

var repository = new FakeSongRepository();
var artistRepository = new FakeArtistRepository();
var tagRepository = new FakeTagRepository();
var producer: ArtistContract = {
	artistType: 'Producer',
	id: 1,
	name: 'Tripshots',
	additionalNames: '',
};
artistRepository.result = producer;
repository.results = {
	title: 'Nebula',
	titleLanguage: 'English',
	artists: [producer],
	matches: [],
	songType: 'Original',
};

function createViewModel(): SongCreateViewModel {
	return new SongCreateViewModel(
		vocaDbContext,
		repository,
		artistRepository,
		tagRepository,
	);
}

test('constructor empty', () => {
	var target = createViewModel();

	expect(target.nameOriginal(), 'nameOriginal').toBe('');
	expect(target.nameEnglish(), 'nameEnglish').toBe('');
	expect(target.pv1(), 'pv1').toBe('');
	expect(target.artists(), 'artists').toBeTruthy();
	expect(target.artists().length, 'artists.length').toBe(0);
});

test('constructor with data', () => {
	var target = new SongCreateViewModel(
		vocaDbContext,
		repository,
		artistRepository,
		tagRepository,
		{ nameEnglish: 'Nebula', artists: [producer] },
	);

	expect(target.nameEnglish(), 'nameEnglish').toBe('Nebula');
	expect(target.artists(), 'artists').toBeTruthy();
	expect(target.artists().length, 'artists.length').toBe(1);
	expect(target.artists()[0].id, 'artist id').toBe(1);
});

test('addArtist', () => {
	var target = createViewModel();

	target.addArtist(1);

	expect(target.artists().length, 'artists.length').toBe(1);
	expect(target.artists()[0].id, 'artist id').toBe(1);
});

test('checkDuplicatesAndPV title and artists', () => {
	var target = createViewModel();

	target.checkDuplicatesAndPV();

	expect(target.nameEnglish(), 'nameEnglish').toBe('Nebula');
	expect(target.artists(), 'artists').toBeTruthy();
	expect(target.artists().length, 'artists.length').toBe(1);
});

test('checkDuplicatesAndPV does not overwrite title', () => {
	var target = createViewModel();
	target.nameOriginal('Overridden title');

	target.checkDuplicatesAndPV();

	expect(target.nameOriginal(), 'nameOriginal').toBe('Overridden title');
});
