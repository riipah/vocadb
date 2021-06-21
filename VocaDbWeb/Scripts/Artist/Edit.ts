import ArtistForEditContract from '@DataContracts/Artist/ArtistForEditContract';
import TranslatedEnumField from '@DataContracts/TranslatedEnumField';
import ArtistRepository from '@Repositories/ArtistRepository';
import UserRepository from '@Repositories/UserRepository';
import DialogService from '@Shared/DialogService';
import UrlMapper from '@Shared/UrlMapper';
import vdb from '@Shared/VdbStatic';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ArtistEditViewModel from '@ViewModels/Artist/ArtistEditViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const artistRepo = container.get(ArtistRepository);
const userRepo = container.get(UserRepository);

function initPage(): void {
	$('#tabs').tabs();
	$('#deleteLink').button({ icons: { primary: 'ui-icon-trash' } });
	$('#restoreLink').button({ icons: { primary: 'ui-icon-trash' } });
	$('#mergeLink').button();
}

const ArtistEdit = (
	model: {
		artist: {
			id: number;
		};
		editedArtist: ArtistForEditContract;
	},
	saveWarning: any,
	webLinkCategoryJson: TranslatedEnumField[],
): void => {
	$(document).ready(function () {
		vdb.resources.entryEdit = {
			saveWarning: saveWarning,
		};

		var urlMapper = new UrlMapper(vocaDbContext.baseAddress);
		var editedModel = model.editedArtist;

		if (editedModel) {
			ko.applyBindings(
				new ArtistEditViewModel(
					vocaDbContext,
					artistRepo,
					userRepo,
					urlMapper,
					webLinkCategoryJson,
					editedModel,
					new DialogService(),
				),
			);
		} else {
			artistRepo.getForEdit({ id: model.artist.id }).then(function (model) {
				ko.applyBindings(
					new ArtistEditViewModel(
						vocaDbContext,
						artistRepo,
						userRepo,
						urlMapper,
						webLinkCategoryJson,
						model,
						new DialogService(),
					),
				);
			});
		}

		initPage();
	});
};

export default ArtistEdit;
