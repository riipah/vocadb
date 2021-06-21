import CommentContract from '@DataContracts/CommentContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import HttpClient from '@Shared/HttpClient';

import { buildUrl, mergeUrls } from './BaseRepository';
import ICommentRepository from './ICommentRepository';
import RepositoryParams from './RepositoryParams';

export default class EntryCommentRepository implements ICommentRepository {
	private baseUrl: string;

	public constructor(
		private readonly httpClient: HttpClient,
		resourcePath: string,
	) {
		this.baseUrl = mergeUrls('/api/', resourcePath);
	}

	public createComment = ({
		baseUrl,
		entryId,
		contract,
	}: RepositoryParams & {
		entryId: number;
		contract: CommentContract;
	}): Promise<CommentContract> => {
		var url = mergeUrls(
			baseUrl,
			buildUrl(this.baseUrl, entryId.toString(), '/comments'),
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
			buildUrl(this.baseUrl, '/comments/', commentId.toString()),
		);
		return this.httpClient.delete<void>(url);
	};

	public getComments = async ({
		baseUrl,
		entryId: listId,
	}: RepositoryParams & { entryId: number }): Promise<CommentContract[]> => {
		var url = mergeUrls(
			baseUrl,
			buildUrl(this.baseUrl, listId.toString(), '/comments/'),
		);
		const result = await this.httpClient.get<
			PartialFindResultContract<CommentContract>
		>(url);
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
			buildUrl(this.baseUrl, '/comments/', commentId.toString()),
		);
		return this.httpClient.post<void>(url, contract);
	};
}
