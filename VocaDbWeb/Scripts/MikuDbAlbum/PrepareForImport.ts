import AlbumContract from '@DataContracts/Album/AlbumContract';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import { initEntrySearch } from '@Shared/EntryAutoComplete';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import $ from 'jquery';

const vocaDbContext = container.get(VocaDbContext);

function initPage(): void {
	function acceptArtistSelection(albumId?: number): void {
		$.get(
			'../../api/albums/' + albumId,
			{ lang: ContentLanguagePreference[vocaDbContext.languagePreference] },
			function (album) {
				$('#mergedAlbumId').append(
					"<option value='" + albumId + "'>" + album.name + '</option>',
				);
				$('#mergedAlbumId').val(`${albumId}`);
				$('#updateAlbumBtn').click();
			},
		);
	}

	var artistAddName = $('input#albumSearchName')[0];

	initEntrySearch(artistAddName, '../../api/albums', {
		acceptSelection: acceptArtistSelection,
		createOptionFirstRow: (item: AlbumContract) => item.name,
		createOptionSecondRow: (item: AlbumContract) => item.additionalNames,
		extraQueryParams: {
			nameMatchMode: 'Auto',
			lang: ContentLanguagePreference[vocaDbContext.languagePreference],
		},
		termParamName: 'query',
	});
}

const MikuDbAlbumPrepareForImport = (): void => {
	$(document).ready(function () {
		initPage();
	});
};

export default MikuDbAlbumPrepareForImport;
