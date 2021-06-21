import SongVoteRating from '@Models/SongVoteRating';
import HttpClient from '@Shared/HttpClient';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import { SongDetailsAjax } from '@ViewModels/Song/SongDetailsViewModel';
import { SongDetailsResources } from '@ViewModels/Song/SongDetailsViewModel';
import SongDetailsViewModel from '@ViewModels/Song/SongDetailsViewModel';
import { SongListsViewModel } from '@ViewModels/Song/SongDetailsViewModel';
import _ from 'lodash';

import FakeSongRepository from '../../TestSupport/FakeSongRepository';
import FakeUserRepository from '../../TestSupport/FakeUserRepository';

const vocaDbContext = container.get(VocaDbContext);

var rep: FakeSongRepository;
var userRep = new FakeUserRepository();
var res: SongDetailsResources = { createNewList: 'Create new list' };
var data: SongDetailsAjax = {
	id: 39,
	version: 0,
	selectedLyricsId: 0,
	selectedPvId: 0,
	songType: 'Original',
	tagUsages: [],
	userRating: 'Nothing',
	latestComments: [],
};

var target: SongDetailsViewModel;

beforeEach(() => {
	rep = new FakeSongRepository();
	rep.songLists = [
		{ id: 1, name: 'Favorite Mikus', featuredCategory: 'Nothing' },
		{ id: 2, name: 'Favorite Lukas', featuredCategory: 'Nothing' },
		{ id: 3, name: 'Mikupa 2013', featuredCategory: 'Concerts' },
	];
	target = new SongDetailsViewModel(
		vocaDbContext,
		new HttpClient(),
		rep,
		userRep,
		null!,
		res,
		false,
		data,
		[],
		false,
		null!,
	);
});

test('constructor', () => {
	expect(target.id, 'id').toBe(39);
	expect(target.songListDialog, 'songListDialog').toBeTruthy();
	expect(target.userRating, 'userRating').toBeTruthy();
	expect(target.userRating.rating(), 'userRating.rating').toBe(
		SongVoteRating['Nothing'],
	);
});

test('showSongLists has lists', () => {
	target.songListDialog.showSongLists();

	expect(
		target.songListDialog.songLists().length,
		'songListDialog.songLists.length',
	).toBe(2);
	expect(
		target.songListDialog.songLists()[0].name,
		'songListDialog.songLists[0].name',
	).toBe('Favorite Mikus');
	expect(
		target.songListDialog.selectedListId(),
		'songListDialog.selectedListId',
	).toBe(1);
});

test('showSongLists no lists', () => {
	rep.songLists = [];
	target.songListDialog.showSongLists();

	expect(
		target.songListDialog.songLists().length,
		'songListDialog.songLists.length',
	).toBe(0);
	expect(
		target.songListDialog.selectedListId(),
		'songListDialog.selectedListId',
	).toBeNull();
});

test('showSongLists only featured lists', () => {
	rep.songLists = [
		{ id: 1, name: 'Mikupa 2013', featuredCategory: 'Concerts' },
	];

	target.songListDialog.showSongLists();

	expect(
		target.songListDialog.songLists().length,
		'songListDialog.songLists.length',
	).toBe(1);
	expect(
		target.songListDialog.songLists()[0].name,
		'songListDialog.songLists[0].name',
	).toBe('Mikupa 2013');
	expect(
		target.songListDialog.selectedListId(),
		'songListDialog.selectedListId',
	).toBe(1);
	expect(target.songListDialog.tabName(), 'target.songListDialog.tabName').toBe(
		SongListsViewModel.tabName_Featured,
	);
});

test('addSongToList', () => {
	target.songListDialog.showSongLists();

	target.songListDialog.addSongToList();

	expect(rep.songLists.length, 'rep.songLists.length').toBe(3);
	var songInList = rep.songsInLists[0];
	expect(songInList.songId, 'songInList.songId: Song as expected').toBe(39);
	expect(songInList.listId, 'songInList.listId: List as expected').toBe(1);
});

test('addSongToList custom list when there are only featured lists', () => {
	rep.songLists = [
		{ id: 1, name: 'Mikupa 2013', featuredCategory: 'Concerts' },
		{ id: 2, name: 'Mikupa 2014', featuredCategory: 'Concerts' },
	];

	target.songListDialog.showSongLists();
	target.songListDialog.tabName(SongListsViewModel.tabName_New);
	target.songListDialog.newListName('Favorite Rinnssss');

	target.songListDialog.addSongToList();

	expect(
		rep.songLists.length,
		'rep.songLists.length: New list was created',
	).toBe(3);
	var newList = _.find(rep.songLists, (sl) => sl.name === 'Favorite Rinnssss')!;
	expect(newList, 'newList: New list was created').toBeTruthy();
	expect(
		rep.songsInLists.length,
		'rep.songsInLists: Song was added to list',
	).toBe(1);
	var songInList = rep.songsInLists[0];
	expect(songInList.songId, 'songInList.songId: Song as expected').toBe(39);
	expect(songInList.listId, 'songInList.listId: List as expected').toBe(
		newList.id,
	);
});

test('tabName featured lists tab', () => {
	target.songListDialog.showSongLists();

	target.songListDialog.tabName('Featured');

	expect(
		target.songListDialog.songLists().length,
		'songListDialog.songLists.length',
	).toBe(1);
	expect(
		target.songListDialog.songLists()[0].name,
		'songListDialog.songLists[0].name',
	).toBe('Mikupa 2013');
});

test('songInListsDialog show', () => {
	target.songInListsDialog.show();

	expect(
		target.songInListsDialog.dialogVisible(),
		'songInListsDialog.dialogVisible',
	).toBe(true);
	expect(
		target.songInListsDialog.contentHtml(),
		'songInListsDialog.contentHtml',
	).toBeTruthy();
});

test('getMatchedSite no match', () => {
	const result = target.getMatchedSite('http://google.com');

	expect(result, 'result is null').toBeNull();
});

test('getMatchedSite match http', () => {
	const result = target.getMatchedSite('http://vocadb.net/S/3939');

	expect(result, 'result is a match').toBeTruthy();
	expect(result.siteUrl, 'Site URL converted to https').toBe(
		'https://vocadb.net/',
	);
	expect(result.id, 'id').toBe(3939);
});

test('getMatchedSite match https', () => {
	const result = target.getMatchedSite('https://vocadb.net/S/3939');

	expect(result, 'result is a match').toBeTruthy();
	expect(result.siteUrl, 'Site URL').toBe('https://vocadb.net/');
	expect(result.id, 'id').toBe(3939);
});
