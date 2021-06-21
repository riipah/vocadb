import ArtistApiContract from '@DataContracts/Artist/ArtistApiContract';
import ArtistContract from '@DataContracts/Artist/ArtistContract';
import ArtistForEditContract from '@DataContracts/Artist/ArtistForEditContract';
import CommentContract from '@DataContracts/CommentContract';
import DuplicateEntryResultContract from '@DataContracts/DuplicateEntryResultContract';
import PagingProperties from '@DataContracts/PagingPropertiesContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import AjaxHelper from '@Helpers/AjaxHelper';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import HttpClient, { HeaderNames, MediaTypes } from '@Shared/HttpClient';
import AdvancedSearchFilter from '@ViewModels/Search/AdvancedSearchFilter';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { CommonQueryParams, mergeUrls } from './BaseRepository';
import ICommentRepository from './ICommentRepository';
import RepositoryParams from './RepositoryParams';

// Repository for managing artists and related objects.
// Corresponds to the ArtistController class.
@injectable()
export default class ArtistRepository implements ICommentRepository {
	// Maps a relative URL to an absolute one.
	private mapUrl: (baseUrl: string | undefined, relative: string) => string;

	public constructor(private readonly httpClient: HttpClient) {
		this.mapUrl = (baseUrl: string | undefined, relative: string): string => {
			return `${mergeUrls(baseUrl, '/Artist')}${relative}`;
		};

		this.findDuplicate = ({
			baseUrl,
			params,
		}: RepositoryParams & { params: any }): Promise<
			DuplicateEntryResultContract[]
		> => {
			return this.httpClient.post<DuplicateEntryResultContract[]>(
				this.mapUrl(baseUrl, '/FindDuplicate'),
				AjaxHelper.stringify(params),
				{
					headers: {
						[HeaderNames.ContentType]: MediaTypes.APPLICATION_FORM_URLENCODED,
					},
				},
			);
		};
	}

	public createComment = ({
		baseUrl,
		entryId: artistId,
		contract,
	}: RepositoryParams & {
		entryId: number;
		contract: CommentContract;
	}): Promise<CommentContract> => {
		return this.httpClient.post<CommentContract>(
			mergeUrls(baseUrl, `/api/artists/${artistId}/comments`),
			contract,
		);
	};

	public createReport = ({
		baseUrl,
		artistId,
		reportType,
		notes,
		versionNumber,
	}: RepositoryParams & {
		artistId: number;
		reportType: string;
		notes: string;
		versionNumber?: number;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			mergeUrls(baseUrl, '/Artist/CreateReport'),
			AjaxHelper.stringify({
				reportType: reportType,
				notes: notes,
				artistId: artistId,
				versionNumber: versionNumber,
			}),
			{
				headers: {
					[HeaderNames.ContentType]: MediaTypes.APPLICATION_FORM_URLENCODED,
				},
			},
		);
	};

	public deleteComment = ({
		baseUrl,
		commentId,
	}: RepositoryParams & {
		commentId: number;
	}): Promise<void> => {
		return this.httpClient.delete<void>(
			mergeUrls(baseUrl, `/api/artists/comments/${commentId}`),
		);
	};

	public findDuplicate: ({
		baseUrl,
		params,
	}: RepositoryParams & { params: any }) => Promise<
		DuplicateEntryResultContract[]
	>;

	public getComments = ({
		baseUrl,
		entryId: artistId,
	}: RepositoryParams & { entryId: number }): Promise<CommentContract[]> => {
		return this.httpClient.get<CommentContract[]>(
			mergeUrls(baseUrl, `/api/artists/${artistId}/comments`),
		);
	};

	public getForEdit = ({
		baseUrl,
		id,
	}: RepositoryParams & {
		id: number;
	}): Promise<ArtistForEditContract> => {
		var url = mergeUrls(baseUrl, `/api/artists/${id}/for-edit`);
		return this.httpClient.get<ArtistForEditContract>(url);
	};

	public getOne = ({
		baseUrl,
		id,
		lang,
	}: RepositoryParams & {
		id: number;
		lang: ContentLanguagePreference;
	}): Promise<ArtistContract> => {
		var url = mergeUrls(baseUrl, `/api/artists/${id}`);
		return this.httpClient.get<ArtistContract>(url, {
			fields: 'AdditionalNames',
			lang: ContentLanguagePreference[lang],
		});
	};

	public getOneWithComponents = ({
		baseUrl,
		id,
		fields,
		lang,
	}: RepositoryParams & {
		id: number;
		fields: string;
		lang: ContentLanguagePreference;
	}): Promise<ArtistApiContract> => {
		var url = mergeUrls(baseUrl, `/api/artists/${id}`);
		return this.httpClient.get<ArtistApiContract>(url, {
			fields: fields,
			lang: ContentLanguagePreference[lang],
		});
	};

	public getList = ({
		baseUrl,
		paging,
		lang,
		query,
		sort,
		artistTypes,
		allowBaseVoicebanks,
		tags,
		childTags,
		followedByUserId,
		fields,
		status,
		advancedFilters,
	}: RepositoryParams & {
		paging: PagingProperties;
		lang: ContentLanguagePreference;
		query: string;
		sort: string;
		artistTypes?: string;
		allowBaseVoicebanks: boolean;
		tags: number[];
		childTags: boolean;
		followedByUserId?: number;
		fields: string;
		status: string;
		advancedFilters: AdvancedSearchFilter[];
	}): Promise<PartialFindResultContract<ArtistContract>> => {
		var url = mergeUrls(baseUrl, '/api/artists');
		var data = {
			start: paging.start,
			getTotalCount: paging.getTotalCount,
			maxResults: paging.maxEntries,
			query: query,
			fields: fields,
			lang: ContentLanguagePreference[lang],
			nameMatchMode: 'Auto',
			sort: sort,
			artistTypes: artistTypes,
			allowBaseVoicebanks: allowBaseVoicebanks,
			tagId: tags,
			childTags: childTags,
			followedByUserId: followedByUserId,
			status: status,
			advancedFilters: advancedFilters,
		};

		return this.httpClient.get<PartialFindResultContract<ArtistContract>>(
			url,
			data,
		);
	};

	public getTagSuggestions = ({
		baseUrl,
		artistId,
	}: RepositoryParams & {
		artistId: number;
	}): Promise<TagUsageForApiContract[]> => {
		return this.httpClient.get<TagUsageForApiContract[]>(
			mergeUrls(baseUrl, `/api/artists/${artistId}/tagSuggestions`),
		);
	};

	public updateComment = ({
		baseUrl,
		commentId,
		contract,
	}: RepositoryParams & {
		commentId: number;
		contract: CommentContract;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			mergeUrls(baseUrl, `/api/artists/comments/${commentId}`),
			contract,
		);
	};
}

export interface ArtistQueryParams extends CommonQueryParams {
	artistTypes: string;
}
