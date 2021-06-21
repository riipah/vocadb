import ReleaseEventRepository from '@Repositories/ReleaseEventRepository';
import { container } from '@Shared/inversify.config';
import ArchivedEntryViewModel from '@ViewModels/ArchivedEntryViewModel';
import $ from 'jquery';
import ko from 'knockout';

const eventRepo = container.get(ReleaseEventRepository);

const EventViewSeriesVersion = (model: {
	entry: {
		archivedVersion: {
			version: number;
		};
		releaseEventSeries: {
			id: number;
		};
	};
}): void => {
	$(function () {
		$('#downloadXmlLink').button({
			icons: { primary: 'ui-icon-arrowthickstop-1-s' },
		});
		$('#reportEntryLink').button({ icons: { primary: 'ui-icon-alert' } });
		$('#showLink').button({ icons: { primary: 'ui-icon-unlocked' } });
		$('#hideLink').button({ icons: { primary: 'ui-icon-locked' } });

		var viewModel = new ArchivedEntryViewModel(
			model.entry.releaseEventSeries.id,
			model.entry.archivedVersion.version,
			eventRepo,
		);
		ko.applyBindings(viewModel);
	});
};

export default EventViewSeriesVersion;
