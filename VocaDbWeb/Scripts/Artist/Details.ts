import CommentContract from '@DataContracts/CommentContract';
import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import AlbumRepository from '@Repositories/AlbumRepository';
import ArtistRepository from '@Repositories/ArtistRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import UrlMapper from '@Shared/UrlMapper';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ArtistDetailsViewModel from '@ViewModels/Artist/ArtistDetailsViewModel';
import PVPlayersFactory from '@ViewModels/PVs/PVPlayersFactory';
import { IEntryReportType } from '@ViewModels/ReportEntryViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const artistRepo = container.get(ArtistRepository);
const albumRepo = container.get(AlbumRepository);
const songRepo = container.get(SongRepository);
const resourceRepo = container.get(ResourceRepository);
const userRepo = container.get(UserRepository);

function initPage(
	artistId: number,
	saveStr: string,
	urlMapper: UrlMapper,
	viewModel: ArtistDetailsViewModel,
	songRepo: SongRepository,
): void {
	$('#addToUserLink').button({
		disabled: $('#addToUserLink').hasClass('disabled'),
		icons: { primary: 'ui-icon-heart' },
	});
	$('#removeFromUserLink')
		.button({
			disabled: $('#removeFromUserLink').hasClass('disabled'),
			icons: { primary: 'ui-icon-close' },
		})
		.next()
		.button({ text: false, icons: { primary: 'ui-icon-triangle-1-s' } })
		.parent()
		.buttonset();
	$('#editArtistLink').button({
		disabled: $('#editArtistLink').hasClass('disabled'),
		icons: { primary: 'ui-icon-wrench' },
	});
	$('#viewVersions').button({ icons: { primary: 'ui-icon-clock' } });
	$('#reportEntryLink').button({ icons: { primary: 'ui-icon-alert' } });
	$('#manageTags').button({ icons: { primary: 'ui-icon-wrench' } });
	$('#viewCommentsLink').click(function () {
		$('#tabs').tabs('option', 'active', 1);
		return false;
	});

	$('#tabs').tabs({
		load: function (event, ui) {
			vdb.functions.disableTabReload(ui.tab);
		},
		activate: function (event, ui) {
			if (ui.newTab.data('tab') === 'Discussion') {
				viewModel.comments.initComments();
			}
		},
	});

	if (window.location.hash === '#mainAlbumsTab') {
		viewModel.initMainAlbums();
	}
	if (window.location.hash === '#collaborationAlbumsTab') {
		viewModel.initCollaborationAlbums();
	}
	if (window.location.hash === '#songsTab') {
		viewModel.initSongs();
	}

	$('#newAlbums img').vdbAlbumToolTip();
	$('#topAlbums img').vdbAlbumToolTip();
	$('#baseVoicebank a').vdbArtistToolTip();
	$('#childVoicebanks a').vdbArtistToolTip();
	$('#groups a').vdbArtistToolTip();
	$('.artistLink').vdbArtistToolTip();
}

const ArtistDetails = (
	canDeleteAllComments: boolean,
	hasEnglishDescription: boolean,
	model: {
		emailNotifications: boolean;
		id: number;
		isAdded: boolean;
		latestComments: CommentContract[];
		siteNotifications: boolean;
		tags: TagUsageForApiContract[];
	},
	reportTypes: IEntryReportType[],
	saveStr: string,
): void => {
	$(function () {
		moment.locale(vocaDbContext.culture);

		var urlMapper = new UrlMapper(vocaDbContext.baseAddress);

		var unknownPictureUrl = urlMapper.mapRelative('/Content/unknown.png');

		var pvPlayerElem = $('#pv-player-wrapper')[0];
		var pvPlayersFactory = new PVPlayersFactory(pvPlayerElem);
		var tagUsages = model.tags;
		var latestComments = model.latestComments;

		var viewModel = new ArtistDetailsViewModel(
			vocaDbContext,
			artistRepo,
			model.id,
			tagUsages,
			model.isAdded,
			model.emailNotifications,
			model.siteNotifications,
			hasEnglishDescription,
			unknownPictureUrl,
			urlMapper,
			albumRepo,
			songRepo,
			resourceRepo,
			userRepo,
			reportTypes,
			canDeleteAllComments,
			pvPlayersFactory,
			latestComments,
		);
		ko.applyBindings(viewModel);

		initPage(model.id, saveStr, urlMapper, viewModel, songRepo);
	});
};

export default ArtistDetails;
