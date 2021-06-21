import PagingProperties from '@DataContracts/PagingPropertiesContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import SongInListContract from '@DataContracts/Song/SongInListContract';
import SongListContract from '@DataContracts/Song/SongListContract';
import SongListForEditContract from '@DataContracts/Song/SongListForEditContract';
import { SongOptionalFields } from '@Models/EntryOptionalFields';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import HttpClient from '@Shared/HttpClient';
import AdvancedSearchFilter from '@ViewModels/Search/AdvancedSearchFilter';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { mergeUrls } from './BaseRepository';
import EntryCommentRepository from './EntryCommentRepository';
import RepositoryParams from './RepositoryParams';

@injectable()
export default class SongListRepository {
	public constructor(private readonly httpClient: HttpClient) {}

	public delete = ({
		baseUrl,
		id,
		notes,
		hardDelete,
	}: RepositoryParams & {
		id: number;
		notes: string;
		hardDelete: boolean;
	}): Promise<void> => {
		return this.httpClient.delete<void>(
			mergeUrls(
				baseUrl,
				`/api/songLists/${id}?hardDelete=${hardDelete}&notes=${encodeURIComponent(
					notes,
				)}`,
			),
		);
	};

	public getComments = ({
		baseUrl,
	}: RepositoryParams & {}): EntryCommentRepository =>
		new EntryCommentRepository(this.httpClient, '/songLists/');

	public getFeatured = ({
		baseUrl,
		query,
		category,
		paging,
		tagIds,
		fields,
		sort,
	}: RepositoryParams & {
		query: string;
		category: string;
		paging: PagingProperties;
		tagIds: number[];
		fields: string;
		sort: string;
	}): Promise<PartialFindResultContract<SongListContract>> => {
		var url = mergeUrls(baseUrl, '/api/songLists/featured');
		return this.httpClient.get<PartialFindResultContract<SongListContract>>(
			url,
			{
				query: query,
				featuredCategory: category,
				start: paging.start,
				getTotalCount: paging.getTotalCount,
				maxResults: paging.maxEntries,
				tagId: tagIds,
				fields: fields,
				sort: sort,
			},
		);
	};

	public getForEdit = ({
		baseUrl,
		id,
	}: RepositoryParams & { id: number }): Promise<SongListForEditContract> => {
		var url = mergeUrls(baseUrl, `/api/songLists/${id}/for-edit`);
		return this.httpClient.get<SongListForEditContract>(url);
	};

	public getSongs = ({
		baseUrl,
		listId,
		query,
		songTypes,
		tagIds,
		childTags,
		artistIds,
		artistParticipationStatus,
		childVoicebanks,
		advancedFilters,
		pvServices,
		paging,
		fields,
		sort,
		lang,
	}: RepositoryParams & {
		listId: number;
		query: string;
		songTypes?: string;
		tagIds: number[];
		childTags: boolean;
		artistIds: number[];
		artistParticipationStatus: string;
		childVoicebanks: boolean;
		advancedFilters: AdvancedSearchFilter[];
		pvServices?: string;
		paging: PagingProperties;
		fields: SongOptionalFields;
		sort: string;
		lang: ContentLanguagePreference;
	}): Promise<PartialFindResultContract<SongInListContract>> => {
		var url = mergeUrls(baseUrl, `/api/songLists/${listId}/songs`);
		var data = {
			query: query,
			songTypes: songTypes,
			tagId: tagIds,
			childTags: childTags,
			artistId: artistIds,
			artistParticipationStatus: artistParticipationStatus,
			childVoicebanks: childVoicebanks,
			advancedFilters: advancedFilters,
			pvServices: pvServices,
			start: paging.start,
			getTotalCount: paging.getTotalCount,
			maxResults: paging.maxEntries,
			fields: fields.fields,
			lang: ContentLanguagePreference[lang],
			sort: sort,
		};

		return this.httpClient.get<PartialFindResultContract<SongInListContract>>(
			url,
			data,
		);
	};
}
