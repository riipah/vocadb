import SongListContract from '@DataContracts/Song/SongListContract';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import { EntryAutoCompleteParams } from '@Shared/EntryAutoComplete';
import { initEntrySearch } from '@Shared/EntryAutoComplete';
import functions from '@Shared/GlobalFunctions';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ko, { Observable } from 'knockout';

const vocaDbContext = container.get(VocaDbContext);

declare global {
	interface KnockoutBindingHandlers {
		songListAutoComplete: KnockoutBindingHandler;
	}
}

// Tag autocomplete search box.
ko.bindingHandlers.songListAutoComplete = {
	init: (
		element: HTMLElement,
		valueAccessor: () => Observable<SongListContract>,
		allBindingsAccessor?: () => any,
	): void => {
		var allBindings = allBindingsAccessor!();
		var category: string = allBindings.songListCategory;

		var queryParams = {
			nameMatchMode: 'Auto',
			lang: ContentLanguagePreference[vocaDbContext.languagePreference],
			preferAccurateMatches: true,
			maxResults: 20,
			sort: 'Name',
			featuredCategory: category,
		};

		var params: EntryAutoCompleteParams<SongListContract> = {
			acceptSelection: (id, term, itemType, item) => {
				valueAccessor()(
					item || {
						id: id!,
						name: term!,
						author: null!,
						description: null!,
						featuredCategory: null!,
						status: null!,
					},
				);
			},
			createOptionFirstRow: (item) => item.name,
			createNewItem: allBindingsAccessor!().createNewItem,
			extraQueryParams: queryParams,
		};

		initEntrySearch(
			element,
			functions.mapAbsoluteUrl('/api/songLists/featured'),
			params,
		);
	},
};
