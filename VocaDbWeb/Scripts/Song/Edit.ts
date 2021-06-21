import SongForEditContract from '@DataContracts/Song/SongForEditContract';
import TranslatedEnumField from '@DataContracts/TranslatedEnumField';
import ArtistRepository from '@Repositories/ArtistRepository';
import PVRepository from '@Repositories/PVRepository';
import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import DialogService from '@Shared/DialogService';
import UrlMapper from '@Shared/UrlMapper';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import SongEditViewModel from '@ViewModels/Song/SongEditViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const songRepo = container.get(SongRepository);
const artistRepo = container.get(ArtistRepository);
const pvRepo = container.get(PVRepository);
const userRepo = container.get(UserRepository);

function initPage(): void {
	$('#tabs').tabs();
	$('#deleteLink').button({ icons: { primary: 'ui-icon-trash' } });
	$('#restoreLink').button({ icons: { primary: 'ui-icon-trash' } });
	$('#mergeLink').button();
	$('#pvLoader')
		.ajaxStart(function (this: any) {
			$(this).show();
		})
		.ajaxStop(function (this: any) {
			$(this).hide();
		});

	$('#artistsTableBody a.artistLink').vdbArtistToolTip();
}

const SongEdit = (
	addExtraArtist: string,
	artistRoleJson: { [key: string]: string },
	canBulkDeletePVs: boolean,
	languageNames: any,
	model: {
		editedSong: SongForEditContract;
		id: number;
		instrumentalTagId: number;
	},
	saveWarning: any,
	webLinkCategoryJson: TranslatedEnumField[],
): void => {
	$(document).ready(function () {
		moment.locale(vocaDbContext.culture);
		ko.punches.enableAll();

		vdb.resources.entryEdit = {
			saveWarning: saveWarning,
		};

		vdb.resources.song = {
			addExtraArtist: addExtraArtist,
		};

		var editedModel = model.editedSong;
		var rootPath = vocaDbContext.baseAddress;
		var urlMapper = new UrlMapper(rootPath);
		var instrumentalTagId = model.instrumentalTagId;
		var vm;

		if (editedModel) {
			vm = new SongEditViewModel(
				vocaDbContext,
				songRepo,
				artistRepo,
				pvRepo,
				userRepo,
				urlMapper,
				artistRoleJson,
				webLinkCategoryJson,
				editedModel,
				canBulkDeletePVs,
				new DialogService(),
				instrumentalTagId,
				languageNames,
			);
			ko.applyBindings(vm);
		} else {
			songRepo.getForEdit({ id: model.id }).then(function (model) {
				vm = new SongEditViewModel(
					vocaDbContext,
					songRepo,
					artistRepo,
					pvRepo,
					userRepo,
					urlMapper,
					artistRoleJson,
					webLinkCategoryJson,
					model,
					canBulkDeletePVs,
					new DialogService(),
					instrumentalTagId,
					languageNames,
				);
				ko.applyBindings(vm);
			});
		}

		initPage();
	});
};

export default SongEdit;
