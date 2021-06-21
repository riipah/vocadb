import EntryReportRepository from '@Repositories/EntryReportRepository';
import RepositoryParams from '@Repositories/RepositoryParams';
import HttpClient from '@Shared/HttpClient';

import FakePromise from './FakePromise';

export default class FakeEntryReportRepository extends EntryReportRepository {
	public entryReportCount!: number;

	public constructor() {
		super(new HttpClient());

		this.getNewReportCount = ({
			baseUrl,
		}: RepositoryParams & {}): Promise<number> => {
			return FakePromise.resolve(this.entryReportCount);
		};
	}
}
