import WebhookContract from '@DataContracts/WebhookContract';
import HttpClient from '@Shared/HttpClient';
import { IPRuleContract } from '@ViewModels/Admin/ManageIPRulesViewModel';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { mergeUrls } from './BaseRepository';
import RepositoryParams from './RepositoryParams';

@injectable()
export default class AdminRepository {
	public constructor(private readonly httpClient: HttpClient) {}

	public addIpToBanList = ({
		baseUrl,
		rule,
	}: RepositoryParams & {
		rule: IPRuleContract;
	}): Promise<boolean> => {
		return this.httpClient.post<boolean>(
			mergeUrls(baseUrl, '/api/ip-rules'),
			rule,
		);
	};

	public checkSFS = ({
		baseUrl,
		ip,
	}: RepositoryParams & {
		ip: string;
	}): Promise<string> => {
		return this.httpClient.get<string>(mergeUrls(baseUrl, '/Admin/CheckSFS'), {
			ip: ip,
		});
	};

	public getTempBannedIps = ({
		baseUrl,
	}: RepositoryParams & {}): Promise<string[]> => {
		return this.httpClient.get<string[]>(
			mergeUrls(baseUrl, '/api/admin/tempBannedIPs'),
		);
	};

	public getWebhooks = ({
		baseUrl,
	}: RepositoryParams & {}): Promise<WebhookContract[]> => {
		return this.httpClient.get<WebhookContract[]>(
			mergeUrls(baseUrl, '/api/webhooks'),
		);
	};

	public saveWebhooks = ({
		baseUrl,
		webhooks,
	}: RepositoryParams & {
		webhooks: WebhookContract[];
	}): Promise<void> => {
		var url = mergeUrls(baseUrl, '/api/webhooks');
		return this.httpClient.put<void>(url, webhooks);
	};
}
