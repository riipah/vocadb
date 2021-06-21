import TagApiContract from '@DataContracts/Tag/TagApiContract';
import EntryType from '@Models/EntryType';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import RepositoryParams from '@Repositories/RepositoryParams';
import TagRepository from '@Repositories/TagRepository';
import HttpClient from '@Shared/HttpClient';

export default class FakeTagRepository extends TagRepository {
	public constructor() {
		super(new HttpClient());

		this.getEntryTypeTag = ({
			baseUrl,
			entryType,
			subType,
			lang,
		}: RepositoryParams & {
			entryType: EntryType;
			subType: string;
			lang: ContentLanguagePreference;
		}): Promise<TagApiContract> => {
			return Promise.resolve<TagApiContract>(null!);
		};
	}
}
