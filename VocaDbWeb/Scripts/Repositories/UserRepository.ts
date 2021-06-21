import CommentContract from '@DataContracts/CommentContract';
import PagingProperties from '@DataContracts/PagingPropertiesContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import ReleaseEventContract from '@DataContracts/ReleaseEvents/ReleaseEventContract';
import SongListContract from '@DataContracts/Song/SongListContract';
import TagBaseContract from '@DataContracts/Tag/TagBaseContract';
import TagSelectionContract from '@DataContracts/Tag/TagSelectionContract';
import TagUsageForApiContract from '@DataContracts/Tag/TagUsageForApiContract';
import AlbumForUserForApiContract from '@DataContracts/User/AlbumForUserForApiContract';
import ArtistForUserForApiContract from '@DataContracts/User/ArtistForUserForApiContract';
import RatedSongForUserForApiContract from '@DataContracts/User/RatedSongForUserForApiContract';
import UserApiContract from '@DataContracts/User/UserApiContract';
import UserMessageSummaryContract from '@DataContracts/User/UserMessageSummaryContract';
import AjaxHelper from '@Helpers/AjaxHelper';
import { Tuple2 } from '@Helpers/HighchartsHelper';
import EntryType from '@Models/EntryType';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import SongVoteRating from '@Models/SongVoteRating';
import UserEventRelationshipType from '@Models/Users/UserEventRelationshipType';
import HttpClient, { HeaderNames, MediaTypes } from '@Shared/HttpClient';
import AdvancedSearchFilter from '@ViewModels/Search/AdvancedSearchFilter';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { mergeUrls } from './BaseRepository';
import ICommentRepository from './ICommentRepository';
import RepositoryParams from './RepositoryParams';

export enum UserInboxType {
	Nothing,
	Received,
	Sent,
	Notifications,
}

// Repository for managing users and related objects.
// Corresponds to the UserController class.
@injectable()
export default class UserRepository implements ICommentRepository {
	// Maps a relative URL to an absolute one.
	private mapUrl: (baseUrl: string | undefined, relative: string) => string;

	public constructor(private readonly httpClient: HttpClient) {
		this.mapUrl = (baseUrl: string | undefined, relative: string): string => {
			return `${mergeUrls(baseUrl, '/User')}${relative}`;
		};
	}

	public addFollowedTag = ({
		baseUrl,
		tagId,
	}: RepositoryParams & {
		tagId: number;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			mergeUrls(baseUrl, `/api/users/current/followedTags/${tagId}`),
		);
	};

	public createArtistSubscription = ({
		baseUrl,
		artistId,
	}: RepositoryParams & {
		artistId: number;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			this.mapUrl(baseUrl, '/AddArtistForUser'),
			AjaxHelper.stringify({
				artistId: artistId,
			}),
			{
				headers: {
					[HeaderNames.ContentType]: MediaTypes.APPLICATION_FORM_URLENCODED,
				},
			},
		);
	};

	public createComment = ({
		baseUrl,
		entryId: userId,
		contract,
	}: RepositoryParams & {
		entryId: number;
		contract: CommentContract;
	}): Promise<CommentContract> => {
		return this.httpClient.post<CommentContract>(
			mergeUrls(baseUrl, `/api/users/${userId}/profileComments`),
			contract,
		);
	};

	public createMessage = ({
		baseUrl,
		userId,
		contract,
	}: RepositoryParams & {
		userId: number;
		contract: UserApiContract;
	}): Promise<UserMessageSummaryContract> => {
		return this.httpClient.post<UserMessageSummaryContract>(
			mergeUrls(baseUrl, `/api/users/${userId}/messages`),
			contract,
		);
	};

	public deleteArtistSubscription = ({
		baseUrl,
		artistId,
	}: RepositoryParams & {
		artistId: number;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			this.mapUrl(baseUrl, '/RemoveArtistFromUser'),
			AjaxHelper.stringify({
				artistId: artistId,
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
			mergeUrls(baseUrl, `/api/users/profileComments/${commentId}`),
		);
	};

	public deleteEventForUser = ({
		baseUrl,
		eventId,
	}: RepositoryParams & {
		eventId: number;
	}): Promise<void> => {
		var url = mergeUrls(baseUrl, `/api/users/current/events/${eventId}`);
		return this.httpClient.delete<void>(url);
	};

	public deleteFollowedTag = ({
		baseUrl,
		tagId,
	}: RepositoryParams & {
		tagId: number;
	}): Promise<void> => {
		return this.httpClient.delete<void>(
			mergeUrls(baseUrl, `/api/users/current/followedTags/${tagId}`),
		);
	};

	public deleteMessage = ({
		baseUrl,
		messageId,
	}: RepositoryParams & {
		messageId: number;
	}): Promise<void> => {
		var url = mergeUrls(baseUrl, '/User/DeleteMessage');
		return this.httpClient.post<void>(
			url,
			AjaxHelper.stringify({ messageId: messageId }),
			{
				headers: {
					[HeaderNames.ContentType]: MediaTypes.APPLICATION_FORM_URLENCODED,
				},
			},
		);
	};

	public deleteMessages = ({
		baseUrl,
		userId,
		messageIds,
	}: RepositoryParams & {
		userId: number;
		messageIds: number[];
	}): Promise<void> => {
		var dataParamName = 'messageId';
		var dataParam =
			'?' + dataParamName + '=' + messageIds.join('&' + dataParamName + '=');
		var url = mergeUrls(baseUrl, `/api/users/${userId}/messages${dataParam}`);
		return this.httpClient.delete<void>(url);
	};

	public getAlbumCollectionList = ({
		baseUrl,
		userId,
		paging,
		lang,
		query,
		tag,
		albumType,
		artistId,
		purchaseStatuses,
		releaseEventId,
		advancedFilters,
		sort,
	}: RepositoryParams & {
		userId: number;
		paging: PagingProperties;
		lang: ContentLanguagePreference;
		query: string;
		tag: number;
		albumType: string;
		artistId: number;
		purchaseStatuses: string;
		releaseEventId: number;
		advancedFilters: AdvancedSearchFilter[];
		sort: string;
	}): Promise<PartialFindResultContract<AlbumForUserForApiContract>> => {
		var url = mergeUrls(baseUrl, `/api/users/${userId}/albums`);
		var data = {
			start: paging.start,
			getTotalCount: paging.getTotalCount,
			maxResults: paging.maxEntries,
			query: query,
			tagId: tag,
			albumTypes: albumType,
			artistId: artistId,
			purchaseStatuses: purchaseStatuses,
			releaseEventId: releaseEventId || undefined,
			fields: 'AdditionalNames,MainPicture',
			lang: ContentLanguagePreference[lang],
			nameMatchMode: 'Auto',
			sort: sort,
			advancedFilters: advancedFilters,
		};

		return this.httpClient.get<
			PartialFindResultContract<AlbumForUserForApiContract>
		>(url, data);
	};

	public getComments = async ({
		baseUrl,
		entryId: userId,
	}: RepositoryParams & { entryId: number }): Promise<CommentContract[]> => {
		var url = mergeUrls(baseUrl, `/api/users/${userId}/profileComments`);
		var data = {
			start: 0,
			getTotalCount: false,
			maxResults: 300,
			userId: userId,
		};

		const result = await this.httpClient.get<
			PartialFindResultContract<CommentContract>
		>(url, data);
		return result.items;
	};

	public getEvents = ({
		baseUrl,
		userId,
		relationshipType,
	}: RepositoryParams & {
		userId: number;
		relationshipType: UserEventRelationshipType;
	}): Promise<ReleaseEventContract[]> => {
		var url = mergeUrls(baseUrl, `/api/users/${userId}/events`);
		return this.httpClient.get<ReleaseEventContract[]>(url, {
			relationshipType: relationshipType,
		});
	};

	public getFollowedArtistsList = ({
		baseUrl,
		userId,
		paging,
		lang,
		tagIds,
		artistType,
	}: RepositoryParams & {
		userId: number;
		paging: PagingProperties;
		lang: ContentLanguagePreference;
		tagIds: number[];
		artistType: string;
	}): Promise<PartialFindResultContract<ArtistForUserForApiContract>> => {
		var url = mergeUrls(baseUrl, `/api/users/${userId}/followedArtists`);
		var data = {
			start: paging.start,
			getTotalCount: paging.getTotalCount,
			maxResults: paging.maxEntries,
			tagId: tagIds,
			fields: 'AdditionalNames,MainPicture',
			lang: ContentLanguagePreference[lang],
			nameMatchMode: 'Auto',
			artistType: artistType,
		};

		return this.httpClient.get<
			PartialFindResultContract<ArtistForUserForApiContract>
		>(url, data);
	};

	public getList = ({
		baseUrl,
		paging,
		query,
		sort,
		groups,
		includeDisabled,
		onlyVerified,
		knowsLanguage,
		nameMatchMode,
		fields,
	}: RepositoryParams & {
		paging: PagingProperties;
		query: string;
		sort?: string;
		groups?: string;
		includeDisabled: boolean;
		onlyVerified: boolean;
		knowsLanguage?: string;
		nameMatchMode: string;
		fields?: string;
	}): Promise<PartialFindResultContract<UserApiContract>> => {
		var url = mergeUrls(baseUrl, '/api/users');
		var data = {
			start: paging.start,
			getTotalCount: paging.getTotalCount,
			maxResults: paging.maxEntries,
			query: query,
			nameMatchMode: nameMatchMode,
			sort: sort,
			includeDisabled: includeDisabled,
			onlyVerified: onlyVerified,
			knowsLanguage: knowsLanguage,
			groups: groups || undefined,
			fields: fields || undefined,
		};

		return this.httpClient.get<PartialFindResultContract<UserApiContract>>(
			url,
			data,
		);
	};

	public getOne = ({
		baseUrl,
		id,
		fields,
	}: RepositoryParams & {
		id: number;
		fields?: string;
	}): Promise<UserApiContract> => {
		var url = mergeUrls(baseUrl, `/api/users/${id}`);
		return this.httpClient.get<UserApiContract>(url, {
			fields: fields || undefined,
		});
	};

	public getOneByName = async ({
		baseUrl,
		username,
	}: RepositoryParams & {
		username: string;
	}): Promise<UserApiContract | null> => {
		const result = await this.getList({
			paging: {},
			query: username,
			sort: undefined,
			groups: undefined,
			includeDisabled: false,
			onlyVerified: false,
			knowsLanguage: undefined,
			nameMatchMode: 'Exact',
			fields: undefined,
		});
		return result.items.length === 1 ? result.items[0] : null;
	};

	public getMessage = ({
		baseUrl,
		messageId,
	}: RepositoryParams & {
		messageId: number;
	}): Promise<UserMessageSummaryContract> => {
		var url = mergeUrls(baseUrl, `/api/users/messages/${messageId}`);
		return this.httpClient.get<UserMessageSummaryContract>(url);
	};

	public getMessageSummaries = ({
		baseUrl,
		userId,
		inbox,
		paging,
		unread = false,
		anotherUserId,
		iconSize = 40,
	}: RepositoryParams & {
		userId: number;
		inbox?: UserInboxType;
		paging: PagingProperties;
		unread: boolean;
		anotherUserId?: number;
		iconSize?: number;
	}): Promise<PartialFindResultContract<UserMessageSummaryContract>> => {
		var url = mergeUrls(baseUrl, `/api/users/${userId}/messages`);
		return this.httpClient.get<
			PartialFindResultContract<UserMessageSummaryContract>
		>(url, {
			inbox: inbox ? UserInboxType[inbox] : undefined,
			start: paging.start,
			maxResults: paging.maxEntries,
			getTotalCount: paging.getTotalCount,
			unread: unread,
			anotherUserId: anotherUserId,
		});
	};

	public getRatedSongsList = ({
		baseUrl,
		userId,
		paging,
		lang,
		query,
		tagIds,
		artistIds,
		childVoicebanks,
		rating,
		songListId,
		advancedFilters,
		groupByRating,
		pvServices,
		fields,
		sort,
	}: RepositoryParams & {
		userId: number;
		paging: PagingProperties;
		lang: ContentLanguagePreference;
		query: string;
		tagIds: number[];
		artistIds: number[];
		childVoicebanks: boolean;
		rating: string;
		songListId: number;
		advancedFilters: AdvancedSearchFilter[];
		groupByRating: boolean;
		pvServices?: string;
		fields: string;
		sort: string;
	}): Promise<PartialFindResultContract<RatedSongForUserForApiContract>> => {
		var url = mergeUrls(baseUrl, `/api/users/${userId}/ratedSongs`);
		var data = {
			start: paging.start,
			getTotalCount: paging.getTotalCount,
			maxResults: paging.maxEntries,
			query: query,
			tagId: tagIds,
			artistId: artistIds,
			childVoicebanks: childVoicebanks,
			rating: rating,
			songListId: songListId,
			advancedFilters: advancedFilters,
			groupByRating: groupByRating,
			pvServices: pvServices,
			fields: fields,
			lang: ContentLanguagePreference[lang],
			nameMatchMode: 'Auto',
			sort: sort,
		};

		return this.httpClient.get<
			PartialFindResultContract<RatedSongForUserForApiContract>
		>(url, data);
	};

	public getRatingsByGenre = ({
		baseUrl,
		userId,
	}: RepositoryParams & {
		userId: number;
	}): Promise<Tuple2<string, number>[]> => {
		var url = mergeUrls(baseUrl, `/api/users/${userId}/songs-per-genre/`);
		return this.httpClient.get<Tuple2<string, number>[]>(url);
	};

	public getSongLists = ({
		baseUrl,
		userId,
		query,
		paging,
		tagIds,
		sort,
		fields,
	}: RepositoryParams & {
		userId: number;
		query?: string;
		paging: PagingProperties;
		tagIds: number[];
		sort: string;
		fields?: string;
	}): Promise<PartialFindResultContract<SongListContract>> => {
		var url = mergeUrls(baseUrl, `/api/users/${userId}/songLists`);
		return this.httpClient.get<PartialFindResultContract<SongListContract>>(
			url,
			{
				query: query,
				start: paging.start,
				getTotalCount: paging.getTotalCount,
				maxResults: paging.maxEntries,
				tagId: tagIds,
				sort: sort,
				fields: fields,
			},
		);
	};

	// Gets a specific user's rating for a specific song.
	// userId: User ID.
	// songId: ID of the song for which to get the rating. Cannot be null.
	// callback: Callback receiving the rating. If the user has not rated the song, or if the user is not logged in, this will be "Nothing".
	public getSongRating = ({
		baseUrl,
		userId,
		songId,
	}: RepositoryParams & {
		userId: number;
		songId: number;
	}): Promise<string> => {
		if (!userId) {
			return Promise.resolve('Nothing');
		}

		var url = mergeUrls(baseUrl, `/api/users/${userId}/ratedSongs/${songId}`);
		return this.httpClient.get<string>(url);
	};

	public getAlbumTagSelections = ({
		baseUrl,
		albumId,
	}: RepositoryParams & {
		albumId: number;
	}): Promise<TagSelectionContract[]> => {
		return this.httpClient.get<TagSelectionContract[]>(
			mergeUrls(baseUrl, `/api/users/current/albumTags/${albumId}`),
		);
	};

	public getArtistTagSelections = ({
		baseUrl,
		artistId,
	}: RepositoryParams & {
		artistId: number;
	}): Promise<TagSelectionContract[]> => {
		return this.httpClient.get<TagSelectionContract[]>(
			mergeUrls(baseUrl, `/api/users/current/artistTags/${artistId}`),
		);
	};

	public getEventTagSelections = ({
		baseUrl,
		eventId,
	}: RepositoryParams & {
		eventId: number;
	}): Promise<TagSelectionContract[]> => {
		return this.httpClient.get<TagSelectionContract[]>(
			mergeUrls(baseUrl, `/api/users/current/eventTags/${eventId}`),
		);
	};

	public getEventSeriesTagSelections = ({
		baseUrl,
		seriesId,
	}: RepositoryParams & {
		seriesId: number;
	}): Promise<TagSelectionContract[]> => {
		return this.httpClient.get<TagSelectionContract[]>(
			mergeUrls(baseUrl, `/api/users/current/eventSeriesTags/${seriesId}`),
		);
	};

	public getSongListTagSelections = ({
		baseUrl,
		songListId,
	}: RepositoryParams & {
		songListId: number;
	}): Promise<TagSelectionContract[]> => {
		return this.httpClient.get<TagSelectionContract[]>(
			mergeUrls(baseUrl, `/api/users/current/songListTags/${songListId}`),
		);
	};

	public getSongTagSelections = ({
		baseUrl,
		songId,
	}: RepositoryParams & {
		songId: number;
	}): Promise<TagSelectionContract[]> => {
		return this.httpClient.get<TagSelectionContract[]>(
			mergeUrls(baseUrl, `/api/users/current/songTags/${songId}`),
		);
	};

	public refreshEntryEdit = ({
		baseUrl,
		entryType,
		entryId,
	}: RepositoryParams & {
		entryType: EntryType;
		entryId: number;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			mergeUrls(
				baseUrl,
				`/api/users/current/refreshEntryEdit/?entryType=${EntryType[entryType]}&entryId=${entryId}`,
			),
		);
	};

	public requestEmailVerification = ({
		baseUrl,
	}: RepositoryParams & {}): Promise<void> => {
		var url = this.mapUrl(baseUrl, '/RequestEmailVerification');
		return this.httpClient.post<void>(url, undefined, {
			headers: {
				[HeaderNames.ContentType]: MediaTypes.APPLICATION_FORM_URLENCODED,
			},
		});
	};

	public updateAlbumTags = ({
		baseUrl,
		albumId,
		tags,
	}: RepositoryParams & {
		albumId: number;
		tags: TagBaseContract[];
	}): Promise<TagUsageForApiContract[]> => {
		return this.httpClient.put<TagUsageForApiContract[]>(
			mergeUrls(baseUrl, `/api/users/current/albumTags/${albumId}`),
			tags,
		);
	};

	// Updates artist subscription settings for an artist followed by a user.
	public updateArtistSubscription = ({
		baseUrl,
		artistId,
		emailNotifications,
		siteNotifications,
	}: RepositoryParams & {
		artistId: number;
		emailNotifications?: boolean;
		siteNotifications?: boolean;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			this.mapUrl(baseUrl, '/UpdateArtistSubscription'),
			AjaxHelper.stringify({
				artistId: artistId,
				emailNotifications: emailNotifications,
				siteNotifications: siteNotifications,
			}),
			{
				headers: {
					[HeaderNames.ContentType]: MediaTypes.APPLICATION_FORM_URLENCODED,
				},
			},
		);
	};

	public updateArtistTags = ({
		baseUrl,
		artistId,
		tags,
	}: RepositoryParams & {
		artistId: number;
		tags: TagBaseContract[];
	}): Promise<TagUsageForApiContract[]> => {
		return this.httpClient.put<TagUsageForApiContract[]>(
			mergeUrls(baseUrl, `/api/users/current/artistTags/${artistId}`),
			tags,
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
			mergeUrls(baseUrl, `/api/users/profileComments/${commentId}`),
			contract,
		);
	};

	public updateEventForUser = ({
		baseUrl,
		eventId,
		associationType,
	}: RepositoryParams & {
		eventId: number;
		associationType: UserEventRelationshipType;
	}): Promise<void> => {
		var url = mergeUrls(baseUrl, `/api/users/current/events/${eventId}`);
		return this.httpClient.post<void>(url, {
			associationType: UserEventRelationshipType[associationType],
		});
	};

	public updateEventTags = ({
		baseUrl,
		eventId,
		tags,
	}: RepositoryParams & {
		eventId: number;
		tags: TagBaseContract[];
	}): Promise<TagUsageForApiContract[]> => {
		return this.httpClient.put<TagUsageForApiContract[]>(
			mergeUrls(baseUrl, `/api/users/current/eventTags/${eventId}`),
			tags,
		);
	};

	public updateEventSeriesTags = ({
		baseUrl,
		seriesId,
		tags,
	}: RepositoryParams & {
		seriesId: number;
		tags: TagBaseContract[];
	}): Promise<TagUsageForApiContract[]> => {
		return this.httpClient.put<TagUsageForApiContract[]>(
			mergeUrls(baseUrl, `/api/users/current/eventSeriesTags/${seriesId}`),
			tags,
		);
	};

	public updateSongListTags = ({
		baseUrl,
		songListId,
		tags,
	}: RepositoryParams & {
		songListId: number;
		tags: TagBaseContract[];
	}): Promise<TagUsageForApiContract[]> => {
		return this.httpClient.put<TagUsageForApiContract[]>(
			mergeUrls(baseUrl, `/api/users/current/songListTags/${songListId}`),
			tags,
		);
	};

	// Updates rating score for a song.
	// songId: Id of the song to be updated.
	// rating: Song rating.
	// callback: Callback function to be executed when the operation is complete.
	public updateSongRating = ({
		baseUrl,
		songId,
		rating,
	}: RepositoryParams & {
		songId: number;
		rating: SongVoteRating;
	}): Promise<void> => {
		var url = mergeUrls(baseUrl, `/api/songs/${songId}/ratings`);
		return this.httpClient.post<void>(url, { rating: SongVoteRating[rating] });
	};

	public updateSongTags = ({
		baseUrl,
		songId,
		tags,
	}: RepositoryParams & {
		songId: number;
		tags: TagBaseContract[];
	}): Promise<TagUsageForApiContract[]> => {
		return this.httpClient.put<TagUsageForApiContract[]>(
			mergeUrls(baseUrl, `/api/users/current/songTags/${songId}`),
			tags,
		);
	};

	// Updates user setting.
	// userId: user ID.
	// settingName: name of the setting to be updated, for example 'showChatBox'.
	// value: setting value, for example 'false'.
	public updateUserSetting = ({
		baseUrl,
		userId,
		settingName,
		value,
	}: RepositoryParams & {
		userId: number;
		settingName: string;
		value: string;
	}): Promise<void> => {
		var url = mergeUrls(
			baseUrl,
			`/api/users/${userId}/settings/${settingName}`,
		);
		return this.httpClient.post<void>(url, `"${value}"`, {
			headers: { [HeaderNames.ContentType]: MediaTypes.APPLICATION_JSON },
		});
	};
}
