import PVContract from '@DataContracts/PVs/PVContract';
import HttpClient from '@Shared/HttpClient';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { mergeUrls } from './BaseRepository';
import RepositoryParams from './RepositoryParams';

@injectable()
export default class PVRepository {
	public constructor(private readonly httpClient: HttpClient) {}

	public getPVByUrl = ({
		baseUrl,
		pvUrl,
		type,
	}: RepositoryParams & {
		pvUrl: string;
		type: string;
	}): Promise<PVContract> => {
		var url = mergeUrls(baseUrl, '/api/pvs');
		return this.httpClient.get<PVContract>(url, { pvUrl: pvUrl, type: type });
	};
}
