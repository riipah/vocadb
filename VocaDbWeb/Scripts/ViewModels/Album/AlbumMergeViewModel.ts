import AlbumContract from '@DataContracts/Album/AlbumContract';
import EntryMergeValidationHelper from '@Helpers/EntryMergeValidationHelper';
import { ArtistAutoCompleteParams } from '@KnockoutExtensions/AutoCompleteParams';
import AlbumRepository from '@Repositories/AlbumRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import ko from 'knockout';

import BasicEntryLinkViewModel from '../BasicEntryLinkViewModel';

export default class AlbumMergeViewModel {
	public constructor(
		vocaDbContext: VocaDbContext,
		repo: AlbumRepository,
		id: number,
	) {
		this.target = new BasicEntryLinkViewModel<AlbumContract>(
			null!,
			(entryId, callback) =>
				repo
					.getOne({ id: entryId, lang: vocaDbContext.languagePreference })
					.then(callback),
		);

		this.targetSearchParams = {
			acceptSelection: this.target.id,
			ignoreId: id,
		};

		repo
			.getOne({ id: id, lang: vocaDbContext.languagePreference })
			.then((base) => {
				ko.computed(() => {
					var result = EntryMergeValidationHelper.validateEntry(
						base,
						this.target.entry(),
					);
					this.validationError_targetIsLessComplete(
						result.validationError_targetIsLessComplete,
					);
					this.validationError_targetIsNewer(
						result.validationError_targetIsNewer,
					);
				});
			});
	}

	public target: BasicEntryLinkViewModel<AlbumContract>;
	public targetSearchParams: ArtistAutoCompleteParams;

	public validationError_targetIsLessComplete = ko.observable(false);
	public validationError_targetIsNewer = ko.observable(false);
}
