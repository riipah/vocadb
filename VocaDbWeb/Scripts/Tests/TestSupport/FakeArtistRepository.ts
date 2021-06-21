import ArtistContract from '@DataContracts/Artist/ArtistContract';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import ArtistRepository from '@Repositories/ArtistRepository';
import RepositoryParams from '@Repositories/RepositoryParams';
import HttpClient from '@Shared/HttpClient';

import FakePromise from './FakePromise';

export default class FakeArtistRepository extends ArtistRepository {
	public result: ArtistContract = null!;

	public constructor() {
		super(new HttpClient());

		this.getOne = ({
			baseUrl,
			id,
			lang,
		}: RepositoryParams & {
			id: number;
			lang: ContentLanguagePreference;
		}): Promise<ArtistContract> => {
			return FakePromise.resolve(this.result);
		};
	}
}
