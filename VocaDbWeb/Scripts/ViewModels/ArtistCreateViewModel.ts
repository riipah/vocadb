import DuplicateEntryResultContract from '@DataContracts/DuplicateEntryResultContract';
import TagApiContract from '@DataContracts/Tag/TagApiContract';
import ArtistType from '@Models/Artists/ArtistType';
import EntryType from '@Models/EntryType';
import ArtistRepository from '@Repositories/ArtistRepository';
import TagRepository from '@Repositories/TagRepository';
import EntryUrlMapper from '@Shared/EntryUrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import ko from 'knockout';

import WebLinkEditViewModel from './WebLinkEditViewModel';

export default class ArtistCreateViewModel {
	public artistType = ko.observable(ArtistType[ArtistType.Producer]);
	public artistTypeTag = ko.observable<TagApiContract>(null!);
	public artistTypeName = ko.computed(() => this.artistTypeTag()?.name);
	public artistTypeInfo = ko.computed(() => this.artistTypeTag()?.description);
	public artistTypeTagUrl = ko.computed(() =>
		EntryUrlMapper.details_tag_contract(this.artistTypeTag()!),
	);

	public checkDuplicates: () => void;

	public dupeEntries = ko.observableArray<DuplicateEntryResultContract>([]);

	private getArtistTypeTag = async (artistType: string): Promise<void> => {
		const tag = await this.tagRepository.getEntryTypeTag({
			entryType: EntryType.Artist,
			subType: artistType,
			lang: this.vocaDbContext.languagePreference,
		});
		this.artistTypeTag(tag);
	};

	public nameOriginal = ko.observable('');
	public nameRomaji = ko.observable('');
	public nameEnglish = ko.observable('');

	public submit = (): boolean => {
		this.submitting(true);
		return true;
	};

	public submitting = ko.observable(false);

	public webLink: WebLinkEditViewModel = new WebLinkEditViewModel();

	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		artistRepository: ArtistRepository,
		private readonly tagRepository: TagRepository,
		data?: { nameOriginal: string; nameRomaji: string; nameEnglish: string },
	) {
		if (data) {
			this.nameOriginal(data.nameOriginal || '');
			this.nameRomaji(data.nameRomaji || '');
			this.nameEnglish(data.nameEnglish || '');
		}

		this.checkDuplicates = (): void => {
			var term1 = this.nameOriginal();
			var term2 = this.nameRomaji();
			var term3 = this.nameEnglish();
			var linkUrl = this.webLink.url();

			artistRepository
				.findDuplicate({
					params: {
						term1: term1,
						term2: term2,
						term3: term3,
						linkUrl: linkUrl,
					},
				})
				.then((result) => {
					this.dupeEntries(result);
				});
		};

		this.artistType.subscribe(this.getArtistTypeTag);
		this.getArtistTypeTag(this.artistType());
	}
}
