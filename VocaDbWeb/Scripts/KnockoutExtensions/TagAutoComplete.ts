import TagApiContract from '@DataContracts/Tag/TagApiContract';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import { EntryAutoCompleteParams } from '@Shared/EntryAutoComplete';
import { initEntrySearch } from '@Shared/EntryAutoComplete';
import functions from '@Shared/GlobalFunctions';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);

declare global {
	interface KnockoutBindingHandlers {
		tagAutoComplete: KnockoutBindingHandler;
	}
}

// Tag autocomplete search box.
ko.bindingHandlers.tagAutoComplete = {
	init: (
		element: HTMLElement,
		valueAccessor: () => any,
		allBindingsAccessor?: () => any,
	): void => {
		var tagFilter: (any: any) => boolean = allBindingsAccessor!().tagFilter;
		var clearValue: boolean = ko.unwrap(allBindingsAccessor!().clearValue);
		var allowAliases: boolean = ko.unwrap(allBindingsAccessor!().allowAliases);

		if (clearValue == null) clearValue = true;

		var queryParams = {
			nameMatchMode: 'Auto',
			fields: 'AdditionalNames',
			lang: ContentLanguagePreference[vocaDbContext.languagePreference],
			preferAccurateMatches: true,
			maxResults: 20,
			sort: 'Name',
			allowAliases: allowAliases,
			target: ko.unwrap(allBindingsAccessor!().tagTarget) || undefined,
		};

		var params: EntryAutoCompleteParams<TagApiContract> = {
			acceptSelection: (id, term, itemType, item) => {
				valueAccessor()(item);
			},
			createNewItem: null!,
			createOptionFirstRow: (item) => item.name,
			createOptionSecondRow: (item) =>
				item.categoryName ? '(' + item.categoryName + ')' : null!,
			extraQueryParams: queryParams,
			filter: tagFilter,
			termParamName: 'query',
			singleRow: true,
		};

		initEntrySearch(element, functions.mapAbsoluteUrl('/api/tags'), params);
	},
};
