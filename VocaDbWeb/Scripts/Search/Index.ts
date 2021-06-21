import AlbumRepository from '@Repositories/AlbumRepository';
import ArtistRepository from '@Repositories/ArtistRepository';
import EntryRepository from '@Repositories/EntryRepository';
import ReleaseEventRepository from '@Repositories/ReleaseEventRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import SongRepository from '@Repositories/SongRepository';
import TagRepository from '@Repositories/TagRepository';
import UserRepository from '@Repositories/UserRepository';
import functions from '@Shared/GlobalFunctions';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import PVPlayersFactory from '@ViewModels/PVs/PVPlayersFactory';
import SearchViewModel from '@ViewModels/Search/SearchViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const resourceRepo = container.get(ResourceRepository);
const entryRepo = container.get(EntryRepository);
const artistRepo = container.get(ArtistRepository);
const albumRepo = container.get(AlbumRepository);
const songRepo = container.get(SongRepository);
const eventRepo = container.get(ReleaseEventRepository);
const tagRepo = container.get(TagRepository);
const userRepo = container.get(UserRepository);

const SearchIndex = (model: {
	artistId: number[];
	artistType: string;
	autoplay: boolean;
	childTags: boolean;
	childVoicebanks: boolean;
	discType: string;
	eventCategory: string;
	eventId: number;
	filter: string;
	minScore: number;
	onlyRatedSongs: boolean;
	onlyWithPVs: boolean;
	pageSize: number;
	searchTypeName: string;
	shuffle: boolean;
	since: number;
	songType: string;
	sort: string;
	tagId: number[];
	viewMode: string;
}): void => {
	$(function () {
		moment.locale(vocaDbContext.culture);
		var query = model.filter;
		var tagIds = model.tagId;
		var searchType = model.searchTypeName;
		var sort = model.sort;
		var artistId = model.artistId;
		var childTags = model.childTags;
		var childVoicebanks = model.childVoicebanks;
		var eventId = model.eventId;
		var artistType = model.artistType;
		var discType = model.discType;
		var songType = model.songType;
		var eventCategory = model.eventCategory;
		var onlyWithPVs = model.onlyWithPVs;
		var onlyRatedSongs = model.onlyRatedSongs;
		var since = model.since;
		var minScore = model.minScore;
		var viewMode = model.viewMode;
		var autoplay = model.autoplay;
		var shuffle = model.shuffle;
		var pageSize = model.pageSize;
		var unknownPictureUrl = functions.mapAbsoluteUrl('/Content/unknown.png');

		var rootPath = vocaDbContext.baseAddress;
		var urlMapper = new UrlMapper(rootPath);
		var pvPlayerElem = $('#pv-player-wrapper')[0];
		var pvPlayersFactory = new PVPlayersFactory(pvPlayerElem);

		var vm = new SearchViewModel(
			vocaDbContext,
			urlMapper,
			entryRepo,
			artistRepo,
			albumRepo,
			songRepo,
			eventRepo,
			tagRepo,
			resourceRepo,
			userRepo,
			unknownPictureUrl,
			searchType,
			query,
			tagIds,
			sort,
			artistId,
			childTags,
			childVoicebanks,
			eventId,
			artistType,
			discType,
			songType,
			eventCategory,
			onlyWithPVs,
			onlyRatedSongs,
			since,
			minScore,
			viewMode,
			autoplay,
			shuffle,
			pageSize,
			pvPlayersFactory,
		);
		ko.applyBindings(vm);
	});
};

export default SearchIndex;
