import SongContract from '@DataContracts/Song/SongContract';
import SearchTextQueryHelper from '@Helpers/SearchTextQueryHelper';
import { SongAutoCompleteParams } from '@KnockoutExtensions/AutoCompleteParams';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import NameMatchMode from '@Models/NameMatchMode';
import { SongQueryParams } from '@Repositories/SongRepository';
import { initEntrySearch } from '@Shared/EntryAutoComplete';
import functions from '@Shared/GlobalFunctions';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);

declare global {
	interface KnockoutBindingHandlers {
		// Song autocomplete search box.
		songAutoComplete: KnockoutBindingHandler;
	}
}

export function songAutoComplete(
	element: HTMLElement,
	valueAccessor: () => any,
): void {
	var properties: SongAutoCompleteParams = ko.utils.unwrapObservable(
		valueAccessor(),
	);

	var filter = properties.filter;

	if (properties.ignoreId) {
		filter = (item): boolean => {
			if (item.id === properties.ignoreId) {
				return false;
			}

			return properties.filter != null ? properties.filter(item) : true;
		};
	}

	var queryParams = {
		nameMatchMode: NameMatchMode[NameMatchMode.Auto],
		lang: ContentLanguagePreference[vocaDbContext.languagePreference],
		preferAccurateMatches: true,
	};
	if (properties.extraQueryParams)
		jQuery.extend(queryParams, properties.extraQueryParams);

	initEntrySearch(element, functions.mapAbsoluteUrl('/api/songs'), {
		acceptSelection: properties.acceptSelection!,
		createNewItem: properties.createNewItem,
		createCustomItem: properties.createCustomItem,
		createOptionFirstRow: (item: SongContract) =>
			item.name + ' (' + item.songType + ')',
		createOptionSecondRow: (item: SongContract) => item.artistString,
		extraQueryParams: queryParams,
		filter: filter,
		termParamName: 'query',
		onQuery: (searchQueryParams: SongQueryParams, term: string) => {
			// Increase the number of results for wildcard queries
			searchQueryParams.maxResults = SearchTextQueryHelper.isWildcardQuery(term)
				? 30
				: 15;
		},
	});
}

ko.bindingHandlers.songAutoComplete = {
	init: songAutoComplete,
};
