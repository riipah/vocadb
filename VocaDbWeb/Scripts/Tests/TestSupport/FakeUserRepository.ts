import PagingProperties from '@DataContracts/PagingPropertiesContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import UserMessageSummaryContract from '@DataContracts/User/UserMessageSummaryContract';
import EntryType from '@Models/EntryType';
import SongVoteRating from '@Models/SongVoteRating';
import RepositoryParams from '@Repositories/RepositoryParams';
import { UserInboxType } from '@Repositories/UserRepository';
import UserRepository from '@Repositories/UserRepository';
import HttpClient from '@Shared/HttpClient';

import FakePromise from './FakePromise';

export default class FakeUserRepository extends UserRepository {
	public message!: UserMessageSummaryContract;
	public messages!: UserMessageSummaryContract[];
	public songId!: number;
	public rating!: SongVoteRating;

	public constructor() {
		super(new HttpClient());

		this.getMessage = ({
			baseUrl,
			messageId,
		}: RepositoryParams & {
			messageId: number;
		}): Promise<UserMessageSummaryContract> => {
			return FakePromise.resolve(this.message);
		};

		this.getMessageSummaries = ({
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
			return FakePromise.resolve<
				PartialFindResultContract<UserMessageSummaryContract>
			>({
				items: this.messages,
				totalCount: this.messages ? this.messages.length : 0,
			});
		};

		this.refreshEntryEdit = ({
			baseUrl,
			entryType,
			entryId,
		}: RepositoryParams & {
			entryType: EntryType;
			entryId: number;
		}): Promise<void> => {
			return Promise.resolve();
		};

		this.updateSongRating = ({
			baseUrl,
			songId,
			rating,
		}: RepositoryParams & {
			songId: number;
			rating: SongVoteRating;
		}): Promise<void> => {
			this.songId = songId;
			this.rating = rating;

			return Promise.resolve();
		};
	}
}
