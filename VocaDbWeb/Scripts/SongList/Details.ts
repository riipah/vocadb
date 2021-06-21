import CommentContract from '@DataContracts/CommentContract';
import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import ArtistRepository from '@Repositories/ArtistRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import SongListRepository from '@Repositories/SongListRepository';
import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import PVPlayersFactory from '@ViewModels/PVs/PVPlayersFactory';
import SongListViewModel from '@ViewModels/SongList/SongListViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const userRepo = container.get(UserRepository);
const songRepo = container.get(SongRepository);
const artistRepo = container.get(ArtistRepository);
const songListRepo = container.get(SongListRepository);
const resourceRepo = container.get(ResourceRepository);

const SongListDetails = (
	canDeleteAllComments: boolean,
	defaultSortRuleName: string,
	model: {
		songList: {
			id: number;
			latestComments: CommentContract[];
			tags: TagUsageForApiContract[];
		};
	},
): void => {
	$(function () {
		$('#editListLink').button({ icons: { primary: 'ui-icon-wrench' } });
		$('#viewVersions').button({ icons: { primary: 'ui-icon-clock' } });
		$('#export').button({ icons: { primary: 'ui-icon-arrowthickstop-1-s' } });

		var listId = model.songList.id;

		var rootPath = vocaDbContext.baseAddress;
		var urlMapper = new UrlMapper(rootPath);
		var pvPlayerElem = $('#pv-player-wrapper')[0];
		var pvPlayersFactory = new PVPlayersFactory(pvPlayerElem);
		var latestComments = model.songList.latestComments;
		var tagUsages = model.songList.tags;

		var vm = new SongListViewModel(
			vocaDbContext,
			urlMapper,
			songListRepo,
			songRepo,
			userRepo,
			artistRepo,
			resourceRepo,
			defaultSortRuleName,
			latestComments,
			listId,
			tagUsages,
			pvPlayersFactory,
			canDeleteAllComments,
		);
		ko.applyBindings(vm);
	});
};

export default SongListDetails;
