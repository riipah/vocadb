import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import VenueForApiContract from '@DataContracts/Venue/VenueForApiContract';
import AjaxHelper from '@Helpers/AjaxHelper';
import NameMatchMode from '@Models/NameMatchMode';
import HttpClient from '@Shared/HttpClient';
import { injectable } from 'inversify';
import 'reflect-metadata';

import { mergeUrls } from './BaseRepository';
import RepositoryParams from './RepositoryParams';

@injectable()
export default class VenueRepository {
	public constructor(private readonly httpClient: HttpClient) {}

	public createReport = ({
		baseUrl,
		entryId: venueId,
		reportType,
		notes,
		versionNumber,
	}: RepositoryParams & {
		entryId: number;
		reportType: string;
		notes: string;
		versionNumber?: number;
	}): Promise<void> => {
		var url = mergeUrls(
			baseUrl,
			`/api/venues/${venueId}/reports?${AjaxHelper.createUrl({
				reportType: [reportType],
				notes: [notes],
				versionNumber: [versionNumber!],
			})}`,
		);
		return this.httpClient.post<void>(url);
	};

	public delete = ({
		baseUrl,
		id,
		notes,
		hardDelete,
	}: RepositoryParams & {
		id: number;
		notes: string;
		hardDelete: boolean;
	}): Promise<void> => {
		return this.httpClient.delete<void>(
			mergeUrls(
				baseUrl,
				`/api/venues/${id}?hardDelete=${hardDelete}&notes=${encodeURIComponent(
					notes,
				)}`,
			),
		);
	};

	public getList = ({
		baseUrl,
		query,
		nameMatchMode,
		maxResults,
	}: RepositoryParams & {
		query: string;
		nameMatchMode: NameMatchMode;
		maxResults: number;
	}): Promise<PartialFindResultContract<VenueForApiContract>> => {
		var url = mergeUrls(baseUrl, '/api/venues');
		var data = {
			query: query,
			maxResults: maxResults,
			nameMatchMode: NameMatchMode[nameMatchMode],
		};

		return this.httpClient.get<PartialFindResultContract<VenueForApiContract>>(
			url,
			data,
		);
	};
}
