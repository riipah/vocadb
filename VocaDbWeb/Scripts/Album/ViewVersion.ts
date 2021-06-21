import AlbumRepository from '@Repositories/AlbumRepository';
import { container } from '@Shared/inversify.config';
import ArchivedAlbumViewModel from '@ViewModels/Album/ArchivedAlbumViewModel';
import $ from 'jquery';
import ko from 'knockout';

const albumRepo = container.get(AlbumRepository);

const AlbumViewVersion = (model: {
	album: {
		id: number;
	};
	archivedVersion: {
		version: number;
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

		var viewModel = new ArchivedAlbumViewModel(
			model.album.id,
			model.archivedVersion.version,
			albumRepo,
		);
		ko.applyBindings(viewModel);
	});
};

export default AlbumViewVersion;
