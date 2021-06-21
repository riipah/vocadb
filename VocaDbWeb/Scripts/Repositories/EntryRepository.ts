import EntryContract from '@DataContracts/EntryContract';
import PagingProperties from '@DataContracts/PagingPropertiesContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import HttpClient from '@Shared/HttpClient';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { mergeUrls } from './BaseRepository';
import RepositoryParams from './RepositoryParams';

// Repository for finding base class of common entry types.
// Corresponds to the EntryApiController.
@injectable()
export default class EntryRepository {
	// Maps a relative URL to an absolute one.
	private mapUrl = (baseUrl: string | undefined, relative: string): string => {
		return mergeUrls(mergeUrls(baseUrl, '/api/entries'), relative);
	};

	public constructor(private readonly httpClient: HttpClient) {}

	public getList = ({
		baseUrl,
		paging,
		lang,
		query,
		tags,
		childTags,
		fields,
		status,
	}: RepositoryParams & {
		paging: PagingProperties;
		lang: ContentLanguagePreference;
		query: string;
		tags: number[];
		childTags: boolean;
		fields: string;
		status: string;
	}): Promise<PartialFindResultContract<EntryContract>> => {
		var url = this.mapUrl(baseUrl, '');
		var data = {
			start: paging.start,
			getTotalCount: paging.getTotalCount,
			maxResults: paging.maxEntries,
			query: query,
			fields: fields,
			lang: ContentLanguagePreference[lang],
			nameMatchMode: 'Auto',
			tagId: tags,
			childTags: childTags,
			status: status,
		};

		return this.httpClient.get<PartialFindResultContract<EntryContract>>(
			url,
			data,
		);
	};
}
