import PagingProperties from '@DataContracts/PagingPropertiesContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import EntryTagMappingContract from '@DataContracts/Tag/EntryTagMappingContract';
import TagApiContract from '@DataContracts/Tag/TagApiContract';
import TagBaseContract from '@DataContracts/Tag/TagBaseContract';
import TagMappingContract from '@DataContracts/Tag/TagMappingContract';
import AjaxHelper from '@Helpers/AjaxHelper';
import EntryType from '@Models/EntryType';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import NameMatchMode from '@Models/NameMatchMode';
import HttpClient from '@Shared/HttpClient';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { CommonQueryParams, mergeUrls } from './BaseRepository';
import EntryCommentRepository from './EntryCommentRepository';
import RepositoryParams from './RepositoryParams';

@injectable()
export default class TagRepository {
	public constructor(private readonly httpClient: HttpClient) {}

	public create = ({
		baseUrl,
		name,
	}: RepositoryParams & {
		name: string;
	}): Promise<TagBaseContract> => {
		var url = mergeUrls(baseUrl, `/api/tags?name=${name}`);
		return this.httpClient.post<TagBaseContract>(url);
	};

	public createReport = ({
		baseUrl,
		entryId: tagId,
		reportType,
		notes,
		versionNumber,
	}: RepositoryParams & {
		entryId: number;
		reportType: string;
		notes: string;
		versionNumber?: number;
	}): Promise<void> => {
		var url = mergeUrls(
			baseUrl,
			`/api/tags/${tagId}/reports?${AjaxHelper.createUrl({
				reportType: [reportType],
				notes: [notes],
				versionNumber: [versionNumber!],
			})}`,
		);
		return this.httpClient.post<void>(url);
	};

	public getById = ({
		baseUrl,
		id,
		fields,
		lang,
	}: RepositoryParams & {
		id: number;
		fields?: string;
		lang?: ContentLanguagePreference;
	}): Promise<TagApiContract> => {
		var url = mergeUrls(baseUrl, `/api/tags/${id}`);
		return this.httpClient.get<TagApiContract>(url, {
			fields: fields || undefined,
			lang: lang ? ContentLanguagePreference[lang] : undefined,
		});
	};

	public getComments = ({
		baseUrl,
	}: RepositoryParams & {}): EntryCommentRepository =>
		new EntryCommentRepository(this.httpClient, '/tags/');

	public getEntryTypeTag = ({
		baseUrl,
		entryType,
		subType,
		lang,
	}: RepositoryParams & {
		entryType: EntryType;
		subType: string;
		lang: ContentLanguagePreference;
	}): Promise<TagApiContract> => {
		var url = mergeUrls(
			baseUrl,
			`/api/entry-types/${EntryType[entryType]}/${subType}/tag`,
		);
		return this.httpClient.get<TagApiContract>(url, {
			fields: 'Description',
			lang: ContentLanguagePreference[lang],
		});
	};

	public getList = ({
		baseUrl,
		queryParams,
	}: RepositoryParams & {
		queryParams: TagQueryParams;
	}): Promise<PartialFindResultContract<TagApiContract>> => {
		var nameMatchMode = queryParams.nameMatchMode || NameMatchMode.Auto;

		var url = mergeUrls(baseUrl, '/api/tags');
		var data = {
			start: queryParams.start,
			getTotalCount: queryParams.getTotalCount,
			maxResults: queryParams.maxResults,
			query: queryParams.query,
			fields: queryParams.fields || undefined,
			nameMatchMode: NameMatchMode[nameMatchMode],
			allowAliases: queryParams.allowAliases,
			categoryName: queryParams.categoryName,
			lang: queryParams.lang
				? ContentLanguagePreference[queryParams.lang]
				: undefined,
			sort: queryParams.sort,
		};

		return this.httpClient.get<PartialFindResultContract<TagApiContract>>(
			url,
			data,
		);
	};

	public getEntryTagMappings = ({
		baseUrl,
	}: RepositoryParams & {}): Promise<EntryTagMappingContract[]> => {
		return this.httpClient.get<EntryTagMappingContract[]>(
			mergeUrls(baseUrl, '/api/tags/entry-type-mappings'),
		);
	};

	public getMappings = ({
		baseUrl,
		paging,
	}: RepositoryParams & {
		paging: PagingProperties;
	}): Promise<PartialFindResultContract<TagMappingContract>> => {
		return this.httpClient.get<PartialFindResultContract<TagMappingContract>>(
			mergeUrls(baseUrl, '/api/tags/mappings'),
			paging,
		);
	};

	public getTopTags = ({
		baseUrl,
		lang,
		categoryName,
		entryType,
	}: RepositoryParams & {
		lang: ContentLanguagePreference;
		categoryName?: string;
		entryType?: EntryType;
	}): Promise<TagBaseContract[]> => {
		var url = mergeUrls(baseUrl, '/api/tags/top');
		var data = {
			lang: ContentLanguagePreference[lang],
			categoryName: categoryName,
			entryType: entryType || undefined,
		};

		return this.httpClient.get<TagBaseContract[]>(url, data);
	};

	public saveEntryMappings = ({
		baseUrl,
		mappings,
	}: RepositoryParams & {
		mappings: EntryTagMappingContract[];
	}): Promise<void> => {
		var url = mergeUrls(baseUrl, '/api/tags/entry-type-mappings');
		return this.httpClient.put<void>(url, mappings);
	};

	public saveMappings = ({
		baseUrl,
		mappings,
	}: RepositoryParams & {
		mappings: TagMappingContract[];
	}): Promise<void> => {
		var url = mergeUrls(baseUrl, '/api/tags/mappings');
		return this.httpClient.put<void>(url, mappings);
	};
}

export interface TagQueryParams extends CommonQueryParams {
	allowAliases?: boolean;

	categoryName?: string;

	// Comma-separated list of optional fields
	fields?: string;

	sort?: string;
}
