import AlbumContract from '@DataContracts/Album/AlbumContract';
import AlbumForApiContract from '@DataContracts/Album/AlbumForApiContract';
import AlbumForEditContract from '@DataContracts/Album/AlbumForEditContract';
import AlbumReviewContract from '@DataContracts/Album/AlbumReviewContract';
import ArtistContract from '@DataContracts/Artist/ArtistContract';
import CommentContract from '@DataContracts/CommentContract';
import DuplicateEntryResultContract from '@DataContracts/DuplicateEntryResultContract';
import PagingProperties from '@DataContracts/PagingPropertiesContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import AlbumForUserForApiContract from '@DataContracts/User/AlbumForUserForApiContract';
import AjaxHelper from '@Helpers/AjaxHelper';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import HttpClient, { HeaderNames, MediaTypes } from '@Shared/HttpClient';
import AdvancedSearchFilter from '@ViewModels/Search/AdvancedSearchFilter';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { CommonQueryParams, mergeUrls } from './BaseRepository';
import ICommentRepository from './ICommentRepository';
import RepositoryParams from './RepositoryParams';

// Repository for managing albums and related objects.
// Corresponds to the AlbumController class.
@injectable()
export default class AlbumRepository implements ICommentRepository {
	// Maps a relative URL to an absolute one.
	private mapUrl: (baseUrl: string | undefined, relative: string) => string;

	public constructor(private readonly httpClient: HttpClient) {
		this.mapUrl = (baseUrl: string | undefined, relative: string): string => {
			return `${mergeUrls(baseUrl, '/Album')}${relative}`;
		};
	}

	public createComment = ({
		baseUrl,
		entryId: albumId,
		contract,
	}: RepositoryParams & {
		entryId: number;
		contract: CommentContract;
	}): Promise<CommentContract> => {
		return this.httpClient.post<CommentContract>(
			mergeUrls(baseUrl, `/api/albums/${albumId}/comments`),
			contract,
		);
	};

	public createOrUpdateReview({
		baseUrl,
		albumId,
		reviewContract,
	}: RepositoryParams & {
		albumId: number;
		reviewContract: AlbumReviewContract;
	}): Promise<AlbumReviewContract> {
		const url = mergeUrls(baseUrl, `/api/albums/${albumId}/reviews`);
		return this.httpClient.post<AlbumReviewContract>(url, reviewContract);
	}

	public createReport = ({
		baseUrl,
		albumId,
		reportType,
		notes,
		versionNumber,
	}: RepositoryParams & {
		albumId: number;
		reportType: string;
		notes: string;
		versionNumber?: number;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			mergeUrls(baseUrl, '/Album/CreateReport'),
			AjaxHelper.stringify({
				reportType: reportType,
				notes: notes,
				albumId: albumId,
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
			mergeUrls(baseUrl, `/api/albums/comments/${commentId}`),
		);
	};

	public deleteReview({
		baseUrl,
		albumId,
		reviewId,
	}: RepositoryParams & {
		albumId: number;
		reviewId: number;
	}): Promise<void> {
		const url = mergeUrls(
			baseUrl,
			`/api/albums/${albumId}/reviews/${reviewId}`,
		);
		return this.httpClient.delete(url);
	}

	public findDuplicate = ({
		baseUrl,
		params,
	}: RepositoryParams & {
		params: {
			term1: string;
			term2: string;
			term3: string;
		};
	}): Promise<DuplicateEntryResultContract[]> => {
		var url = mergeUrls(baseUrl, '/Album/FindDuplicate');
		return this.httpClient.get<DuplicateEntryResultContract[]>(url, params);
	};

	public getComments = ({
		baseUrl,
		entryId: albumId,
	}: RepositoryParams & { entryId: number }): Promise<CommentContract[]> => {
		return this.httpClient.get<CommentContract[]>(
			mergeUrls(baseUrl, `/api/albums/${albumId}/comments`),
		);
	};

	public getForEdit = ({
		baseUrl,
		id,
	}: RepositoryParams & {
		id: number;
	}): Promise<AlbumForEditContract> => {
		var url = mergeUrls(baseUrl, `/api/albums/${id}/for-edit`);
		return this.httpClient.get<AlbumForEditContract>(url);
	};

	public getOne = ({
		baseUrl,
		id,
		lang,
	}: RepositoryParams & {
		id: number;
		lang: ContentLanguagePreference;
	}): Promise<AlbumContract> => {
		var url = mergeUrls(baseUrl, `/api/albums/${id}`);
		return this.httpClient.get<AlbumContract>(url, {
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
	}): Promise<AlbumForApiContract> => {
		var url = mergeUrls(baseUrl, `/api/albums/${id}`);
		return this.httpClient.get<AlbumForApiContract>(url, {
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
		discTypes,
		tags,
		childTags,
		artistIds,
		artistParticipationStatus,
		childVoicebanks,
		includeMembers,
		fields,
		status,
		deleted,
		advancedFilters,
	}: RepositoryParams & {
		paging: PagingProperties;
		lang: ContentLanguagePreference;
		query: string;
		sort: string;
		discTypes?: string;
		tags?: number[];
		childTags?: boolean;
		artistIds?: number[];
		artistParticipationStatus?: string;
		childVoicebanks?: boolean;
		includeMembers?: boolean;
		fields: string;
		status?: string;
		deleted: boolean;
		advancedFilters?: AdvancedSearchFilter[];
	}): Promise<PartialFindResultContract<AlbumContract>> => {
		var url = mergeUrls(baseUrl, '/api/albums');
		var data = {
			start: paging.start,
			getTotalCount: paging.getTotalCount,
			maxResults: paging.maxEntries,
			query: query,
			fields: fields,
			lang: ContentLanguagePreference[lang],
			nameMatchMode: 'Auto',
			sort: sort,
			discTypes: discTypes,
			tagId: tags,
			childTags: childTags || undefined,
			artistId: artistIds,
			artistParticipationStatus: artistParticipationStatus,
			childVoicebanks: childVoicebanks,
			includeMembers: includeMembers || undefined,
			status: status,
			deleted: deleted,
			advancedFilters: advancedFilters,
		};

		return this.httpClient.get<PartialFindResultContract<AlbumContract>>(
			url,
			data,
		);
	};

	public getReviews = ({
		baseUrl,
		albumId,
	}: RepositoryParams & { albumId: number }): Promise<
		AlbumReviewContract[]
	> => {
		const url = mergeUrls(baseUrl, `/api/albums/${albumId}/reviews`);
		return this.httpClient.get<AlbumReviewContract[]>(url);
	};

	public getTagSuggestions = ({
		baseUrl,
		albumId,
	}: RepositoryParams & {
		albumId: number;
	}): Promise<TagUsageForApiContract[]> => {
		return this.httpClient.get<TagUsageForApiContract[]>(
			mergeUrls(baseUrl, `/api/albums/${albumId}/tagSuggestions`),
		);
	};

	public async getUserCollections({
		baseUrl,
		albumId,
	}: RepositoryParams & {
		albumId: number;
	}): Promise<AlbumForUserForApiContract[]> {
		const url = mergeUrls(baseUrl, `/api/albums/${albumId}/user-collections`);
		return this.httpClient.get<AlbumForUserForApiContract[]>(url);
	}

	public updateComment = ({
		baseUrl,
		commentId,
		contract,
	}: RepositoryParams & {
		commentId: number;
		contract: CommentContract;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			mergeUrls(baseUrl, `/api/albums/comments/${commentId}`),
			contract,
		);
	};

	public updatePersonalDescription = ({
		baseUrl,
		albumId,
		text,
		author,
	}: RepositoryParams & {
		albumId: number;
		text: string;
		author: ArtistContract;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			mergeUrls(baseUrl, `/api/albums/${albumId}/personal-description/`),
			{
				personalDescriptionText: text,
				personalDescriptionAuthor: author || undefined,
			},
		);
	};
}

export interface AlbumQueryParams extends CommonQueryParams {
	discTypes: string;
}
