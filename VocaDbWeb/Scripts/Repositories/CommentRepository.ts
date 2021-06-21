import CommentContract from '@DataContracts/CommentContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import EntryType from '@Models/EntryType';
import HttpClient from '@Shared/HttpClient';

import { buildUrl, mergeUrls } from './BaseRepository';
import ICommentRepository from './ICommentRepository';
import RepositoryParams from './RepositoryParams';

export default class CommentRepository implements ICommentRepository {
	public constructor(
		private readonly httpClient: HttpClient,
		private entryType: EntryType,
	) {}

	public createComment = ({
		baseUrl,
		entryId,
		contract,
	}: RepositoryParams & {
		entryId: number;
		contract: CommentContract;
	}): Promise<CommentContract> => {
		contract.entry = {
			entryType: EntryType[this.entryType],
			id: entryId,
			name: null!,
		};
		var url = mergeUrls(
			baseUrl,
			buildUrl(`api/comments/${EntryType[this.entryType]}-comments`),
		);
		return this.httpClient.post<CommentContract>(url, contract);
	};

	public deleteComment = ({
		baseUrl,
		commentId,
	}: RepositoryParams & {
		commentId: number;
	}): Promise<void> => {
		var url = mergeUrls(
			baseUrl,
			buildUrl(
				`api/comments/${EntryType[this.entryType]}-comments/`,
				commentId.toString(),
			),
		);
		return this.httpClient.delete<void>(url);
	};

	public getComments = async ({
		baseUrl,
		entryId: listId,
	}: RepositoryParams & { entryId: number }): Promise<CommentContract[]> => {
		var url = mergeUrls(
			baseUrl,
			buildUrl(`api/comments/${EntryType[this.entryType]}-comments/`),
		);
		const result = await this.httpClient.get<
			PartialFindResultContract<CommentContract>
		>(url, { entryId: listId });
		return result.items;
	};

	public updateComment = ({
		baseUrl,
		commentId,
		contract,
	}: RepositoryParams & {
		commentId: number;
		contract: CommentContract;
	}): Promise<void> => {
		var url = mergeUrls(
			baseUrl,
			buildUrl(
				`api/comments/${EntryType[this.entryType]}-comments/`,
				commentId.toString(),
			),
		);
		return this.httpClient.post<void>(url, contract);
	};
}
