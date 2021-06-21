import ArtistRepository from '@Repositories/ArtistRepository';
import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import functions from '@Shared/GlobalFunctions';
import HttpClient from '@Shared/HttpClient';
import ui from '@Shared/MessagesTyped';
import UrlMapper from '@Shared/UrlMapper';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import { IEntryReportType } from '@ViewModels/ReportEntryViewModel';
import SongDetailsViewModel, {
	SongDetailsAjax,
	SongDetailsResources,
} from '@ViewModels/Song/SongDetailsViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const songRepo = container.get(SongRepository);
const userRepo = container.get(UserRepository);
const artistRepo = container.get(ArtistRepository);

function initPage(
	jsonModel: SongDetailsAjax,
	songId: number,
	saveStr: string,
	urlMapper: UrlMapper,
	viewModel: SongDetailsViewModel,
): void {
	function initMediaPlayer(): void {
		$('audio').mediaelementplayer({
			pluginPath: 'https://cdnjs.com/libraries/mediaelement/',
		});
	}

	$('.js-ratingButtons').buttonset();
	$('#reportEntryLink').button({ icons: { primary: 'ui-icon-alert' } });
	$('#manageTags').button({ icons: { primary: 'ui-icon-wrench' } });
	$('#viewVersions').button({ icons: { primary: 'ui-icon-clock' } });
	$('#viewCommentsLink').click(function () {
		var index = $('#tabs ul [data-tab="Discussion"]').index();
		$('#tabs').tabs('option', 'active', index);
		return false;
	});
	$('#viewRelatedLink').click(function () {
		var index = $('#tabs ul [data-tab="Related"]').index();
		$('#tabs').tabs('option', 'active', index);
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

	$('#pvLoader')
		.ajaxStart(function (this: any) {
			$(this).show();
		})
		.ajaxStop(function (this: any) {
			$(this).hide();
		});

	$('.pvLink:not(.disabled)').click(function (this: any) {
		var id = functions.getId(this);
		$.post(
			urlMapper.mapRelative('/Song/PVForSong'),
			{ pvId: id },
			function (content) {
				$('#pvPlayer').html(content);
				initMediaPlayer();
			},
		);

		return false;
	});

	$('td.artistList a').vdbArtistToolTip();
	$('#albumList a').vdbAlbumWithCoverToolTip();
	initMediaPlayer();
}

const SongDetails = (
	canDeleteAllComments: boolean,
	model: {
		id: number;
		jsonModel: SongDetailsAjax;
	},
	reportTypes: IEntryReportType[],
	resources: SongDetailsResources,
	saveStr: string,
	showTranslatedDescription: boolean,
): void => {
	$(document).ready(function () {
		moment.locale(vocaDbContext.culture);

		vdb.resources.song = resources;

		var jsonModel = model.jsonModel;
		const httpClient = new HttpClient();
		var rootPath = vocaDbContext.baseAddress;
		var urlMapper = new UrlMapper(rootPath);

		var viewModel = new SongDetailsViewModel(
			vocaDbContext,
			httpClient,
			songRepo,
			userRepo,
			artistRepo,
			resources,
			showTranslatedDescription,
			jsonModel,
			reportTypes,
			canDeleteAllComments,
			ui.showThankYouForRatingMessage,
		);
		ko.applyBindings(viewModel);

		viewModel.songListDialog.addedToList = function (): void {
			ui.showSuccessMessage(resources.addedToList);
		};

		initPage(jsonModel, model.id, saveStr, urlMapper, viewModel);
	});
};

export default SongDetails;
