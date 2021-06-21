import CommentContract from '@DataContracts/CommentContract';
import DiscussionFolderContract from '@DataContracts/Discussion/DiscussionFolderContract';
import DiscussionTopicContract from '@DataContracts/Discussion/DiscussionTopicContract';
import PagingProperties from '@DataContracts/PagingPropertiesContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import HttpClient from '@Shared/HttpClient';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { mergeUrls } from './BaseRepository';
import ICommentRepository from './ICommentRepository';
import RepositoryParams from './RepositoryParams';

@injectable()
export default class DiscussionRepository implements ICommentRepository {
	public constructor(private readonly httpClient: HttpClient) {}

	private mapUrl = (baseUrl: string | undefined, relative: string): string => {
		return mergeUrls(baseUrl, mergeUrls('/api/discussions', relative));
	};

	public createComment = ({
		baseUrl,
		entryId: topicId,
		contract,
	}: RepositoryParams & {
		entryId: number;
		contract: CommentContract;
	}): Promise<CommentContract> => {
		return this.httpClient.post<CommentContract>(
			this.mapUrl(baseUrl, `topics/${topicId}/comments`),
			contract,
		);
	};

	public createTopic = ({
		baseUrl,
		folderId,
		contract,
	}: RepositoryParams & {
		folderId: number;
		contract: DiscussionTopicContract;
	}): Promise<DiscussionTopicContract> => {
		return this.httpClient.post<DiscussionTopicContract>(
			this.mapUrl(baseUrl, `folders/${folderId}/topics`),
			contract,
		);
	};

	public deleteComment = ({
		baseUrl,
		commentId,
	}: RepositoryParams & { commentId: number }): Promise<void> => {
		return this.httpClient.delete<void>(
			this.mapUrl(baseUrl, `comments/${commentId}`),
		);
	};

	public deleteTopic = ({
		baseUrl,
		topicId,
	}: RepositoryParams & {
		topicId: number;
	}): Promise<void> => {
		return this.httpClient.delete<void>(
			this.mapUrl(baseUrl, `topics/${topicId}`),
		);
	};

	public getComments = ({
		baseUrl,
		entryId: topicId,
	}: RepositoryParams & { entryId: number }): Promise<CommentContract[]> => {
		// Not supported
		return Promise.resolve<CommentContract[]>([]);
	};

	public getFolders = ({
		baseUrl,
	}: RepositoryParams & {}): Promise<DiscussionFolderContract[]> => {
		return this.httpClient.get<DiscussionFolderContract[]>(
			this.mapUrl(baseUrl, 'folders'),
			{
				fields: 'LastTopic,TopicCount',
			},
		);
	};

	public getTopic = ({
		baseUrl,
		topicId,
	}: RepositoryParams & {
		topicId: number;
	}): Promise<DiscussionTopicContract> => {
		return this.httpClient.get<DiscussionTopicContract>(
			this.mapUrl(baseUrl, `topics/${topicId}`),
			{ fields: 'All' },
		);
	};

	public getTopics = ({
		baseUrl,
	}: RepositoryParams & {}): Promise<
		PartialFindResultContract<DiscussionTopicContract>
	> => {
		return this.httpClient.get<
			PartialFindResultContract<DiscussionTopicContract>
		>(this.mapUrl(baseUrl, 'topics'), {
			fields: 'CommentCount',
			maxResults: 5,
		});
	};

	public getTopicsForFolder = ({
		baseUrl,
		folderId,
		paging,
	}: RepositoryParams & {
		folderId: number;
		paging: PagingProperties;
	}): Promise<PartialFindResultContract<DiscussionTopicContract>> => {
		return this.httpClient.get<
			PartialFindResultContract<DiscussionTopicContract>
		>(this.mapUrl(baseUrl, 'topics'), {
			folderId: folderId,
			fields: 'CommentCount,LastComment',
			start: paging.start,
			maxResults: paging.maxEntries,
			getTotalCount: paging.getTotalCount,
		});
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
			this.mapUrl(baseUrl, `comments/${commentId}`),
			contract,
		);
	};

	public updateTopic = ({
		baseUrl,
		topicId,
		contract,
	}: RepositoryParams & {
		topicId: number;
		contract: DiscussionTopicContract;
	}): Promise<void> => {
		return this.httpClient.post<void>(
			this.mapUrl(baseUrl, `topics/${topicId}`),
			contract,
		);
	};
}
