import SongContract from '@DataContracts/Song/SongContract';
import EntryMergeValidationHelper from '@Helpers/EntryMergeValidationHelper';
import { SongAutoCompleteParams } from '@KnockoutExtensions/AutoCompleteParams';
import SongRepository from '@Repositories/SongRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import ko from 'knockout';

import BasicEntryLinkViewModel from '../BasicEntryLinkViewModel';

export default class SongMergeViewModel {
	public constructor(
		vocaDbContext: VocaDbContext,
		songRepo: SongRepository,
		private base: SongContract,
	) {
		this.target = new BasicEntryLinkViewModel<SongContract>(
			null!,
			(entryId, callback) =>
				songRepo
					.getOne({ id: entryId, lang: vocaDbContext.languagePreference })
					.then(callback),
		);

		this.targetSearchParams = {
			acceptSelection: this.target.id,
			ignoreId: base.id,
		};

		ko.computed(() => {
			var result = EntryMergeValidationHelper.validateEntry(
				this.base,
				this.target.entry(),
			);
			this.validationError_targetIsLessComplete(
				result.validationError_targetIsLessComplete,
			);
			this.validationError_targetIsNewer(result.validationError_targetIsNewer);
		});

		/*this.validationError_targetIsLessComplete = ko.computed(helpers.EntryMergeValidationHelper.() => this.target.entry() &&
				models.EntryStatus[this.target.entry().status] < models.EntryStatus[this.base.status]);

			this.validationError_targetIsNewer = ko.computed(() => this.target.entry() &&
				moment(this.target.entry().createDate) > moment(this.base.createDate));*/
	}

	public target: BasicEntryLinkViewModel<SongContract>;
	public targetSearchParams: SongAutoCompleteParams;

	public validationError_targetIsLessComplete = ko.observable(false);
	public validationError_targetIsNewer = ko.observable(false);

	//public validationError_targetIsLessComplete: Observable<boolean>;
	//public validationError_targetIsNewer: Observable<boolean>;
}
