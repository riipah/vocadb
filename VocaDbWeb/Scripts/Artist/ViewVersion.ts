import ArtistRepository from '@Repositories/ArtistRepository';
import { container } from '@Shared/inversify.config';
import ArchivedArtistViewModel from '@ViewModels/Artist/ArchivedArtistViewModel';
import $ from 'jquery';
import ko from 'knockout';

const artistRepo = container.get(ArtistRepository);

const ArtistViewVersion = (model: {
	archivedVersion: {
		version: number;
	};
	artist: {
		id: number;
	};
}): void => {
	$(function () {
		$('#revertLink').button({ icons: { primary: 'ui-icon-arrowrefresh-1-w' } });
		$('#downloadXmlLink').button({
			icons: { primary: 'ui-icon-arrowthickstop-1-s' },
		});
		$('#reportEntryLink').button({ icons: { primary: 'ui-icon-alert' } });
		$('#showLink').button({ icons: { primary: 'ui-icon-unlocked' } });
		$('#hideLink').button({ icons: { primary: 'ui-icon-locked' } });

		var viewModel = new ArchivedArtistViewModel(
			model.artist.id,
			model.archivedVersion.version,
			artistRepo,
		);
		ko.applyBindings(viewModel);
	});
};

export default ArtistViewVersion;
