import VenueRepository from '@Repositories/VenueRepository';
import ui from '@Shared/MessagesTyped';
import vdb from '@Shared/VdbStatic';

import { IEntryReportType } from '../ReportEntryViewModel';
import ReportEntryViewModel from '../ReportEntryViewModel';

export default class VenueDetailsViewModel {
	public constructor(
		repo: VenueRepository,
		reportTypes: IEntryReportType[],
		venueId: number,
	) {
		this.reportViewModel = new ReportEntryViewModel(
			reportTypes,
			(reportType, notes) => {
				repo.createReport({
					entryId: venueId,
					reportType: reportType,
					notes: notes,
					versionNumber: undefined,
				});
				ui.showSuccessMessage(vdb.resources.shared.reportSent);
			},
		);
	}

	public reportViewModel: ReportEntryViewModel;
}
