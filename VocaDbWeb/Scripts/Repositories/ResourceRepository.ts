import ResourcesContract from '@DataContracts/ResourcesContract';
import HttpClient from '@Shared/HttpClient';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { mergeUrls } from './BaseRepository';
import RepositoryParams from './RepositoryParams';

@injectable()
export default class ResourceRepository {
	public constructor(private readonly httpClient: HttpClient) {}

	public getList = ({
		baseUrl,
		cultureCode,
		setNames,
	}: RepositoryParams & {
		cultureCode: string;
		setNames: string[];
	}): Promise<ResourcesContract> => {
		var url = mergeUrls(baseUrl, `/api/resources/${cultureCode}/`);
		return this.httpClient.get<ResourcesContract>(url, { setNames: setNames });
	};
}
