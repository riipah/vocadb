import AlbumRepository from '@Repositories/AlbumRepository';
import ArtistRepository from '@Repositories/ArtistRepository';
import UserRepository from '@Repositories/UserRepository';
import ui from '@Shared/MessagesTyped';
import UrlMapper from '@Shared/UrlMapper';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import AlbumDetailsViewModel, {
	AlbumDetailsAjax,
} from '@ViewModels/Album/AlbumDetailsViewModel';
import { IEntryReportType } from '@ViewModels/ReportEntryViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const albumRepo = container.get(AlbumRepository);
const userRepo = container.get(UserRepository);
const artistRepo = container.get(ArtistRepository);

function initAlbumDetailsPage(
	albumId: number,
	collectionRating: number,
	saveStr: string,
	urlMapper: UrlMapper,
	viewModel: AlbumDetailsViewModel,
): void {
	$('#addAlbumLink').button({
		disabled: $('#addAlbumLink').hasClass('disabled'),
		icons: { primary: 'ui-icon-star' },
	});
	$('#updateAlbumLink').button({
		disabled: $('#updateAlbumLink').hasClass('disabled'),
		icons: { primary: 'ui-icon-wrench' },
	});
	$('#editAlbumLink').button({
		disabled: $('#editAlbumLink').hasClass('disabled'),
		icons: { primary: 'ui-icon-wrench' },
	});
	$('#reportEntryLink').button({ icons: { primary: 'ui-icon-alert' } });
	$('#viewVersions').button({ icons: { primary: 'ui-icon-clock' } });
	$('#downloadTags')
		.button({ icons: { primary: 'ui-icon-arrowthickstop-1-s' } })
		.next()
		.button({ text: false, icons: { primary: 'ui-icon-triangle-1-s' } })
		.parent()
		.buttonset();
	$('#manageTags').button({ icons: { primary: 'ui-icon-wrench' } });
	$('#viewCommentsLink').click(function () {
		$('#tabs').tabs('option', 'active', 1);
		return false;
	});
	$('#viewReviewsLink').click(function () {
		$('#tabs').tabs('option', 'active', 2);
		return false;
	});

	$('#picCarousel').carousel({ interval: false });

	$('#collectionRating').jqxRating();

	if (collectionRating !== 0) {
		$('#collectionRating').jqxRating({ value: collectionRating });
	}

	$('#removeRating').click(function () {
		$('#collectionRating').jqxRating('setValue', 0);

		return false;
	});

	$('#tabs').tabs({
		load: function (event, ui) {
			vdb.functions.disableTabReload(ui.tab);
		},
		activate: function (event, ui) {
			switch (ui.newTab.data('tab')) {
				case 'Discussion':
					viewModel.comments.initComments();
					break;
				case 'Reviews':
					viewModel.reviewsViewModel.loadReviews();
					break;
			}
		},
	});

	$('#editCollectionDialog').dialog({
		autoOpen: false,
		width: 320,
		modal: false,
		buttons: [
			{
				text: saveStr,
				click: function (): void {
					$('#editCollectionDialog').dialog('close');

					var status = $('#collectionStatusSelect').val();
					var mediaType = $('#collectionMediaSelect').val();
					var rating = $('#collectionRating').jqxRating('getValue');

					$.post(
						urlMapper.mapRelative('/User/UpdateAlbumForUser'),
						{
							albumId: albumId,
							collectionStatus: status,
							mediaType: mediaType,
							rating: rating,
						},
						null!,
					);

					if (status === 'Nothing') {
						$('#updateAlbumLink').hide();
						$('#addAlbumLink').show();
					} else {
						$('#addAlbumLink').hide();
						$('#updateAlbumLink').show();
					}

					ui.showSuccessMessage(vdb.resources.album.addedToCollection);
				},
			},
		],
	});

	var addAlbumLink;
	if ($('#addAlbumLink').is(':visible')) addAlbumLink = $('#addAlbumLink');
	else addAlbumLink = $('#updateAlbumLink');

	$('#editCollectionDialog').dialog('option', 'position', {
		my: 'left top',
		at: 'left bottom',
		of: addAlbumLink,
	});

	$('#addAlbumLink').click(function () {
		$('#editCollectionDialog').dialog('open');
		return false;
	});

	$('#updateAlbumLink').click(function () {
		$('#editCollectionDialog').dialog('open');
		return false;
	});

	$('td.artistList a').vdbArtistToolTip();

	$('#userCollectionsPopup').dialog({
		autoOpen: false,
		width: 400,
		position: { my: 'left top', at: 'left bottom', of: $('#statsLink') },
	});
}

const AlbumDetails = (
	addedToCollection: string,
	albumDetails: typeof vdb.resources.albumDetails,
	canDeleteAllComments: boolean,
	formatString: string,
	model: {
		collectionRating: number;
		id: number;
		jsonModel: AlbumDetailsAjax;
	},
	reportTypes: IEntryReportType[],
	saveStr: string,
	showTranslatedDescription: boolean,
): void => {
	$(document).ready(function () {
		moment.locale(vocaDbContext.culture);
		ko.punches.enableAll();

		var urlMapper = new UrlMapper(vocaDbContext.baseAddress);

		vdb.resources.album = {
			addedToCollection: addedToCollection,
		};
		vdb.resources.albumDetails = albumDetails;

		var jsonModel = model.jsonModel;
		var viewModel = new AlbumDetailsViewModel(
			vocaDbContext,
			albumRepo,
			userRepo,
			artistRepo,
			jsonModel,
			reportTypes,
			canDeleteAllComments,
			formatString,
			showTranslatedDescription,
		);
		ko.applyBindings(viewModel);

		initAlbumDetailsPage(
			model.id,
			model.collectionRating,
			saveStr,
			urlMapper,
			viewModel,
		);
	});
};

export default AlbumDetails;
