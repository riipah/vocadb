import ArtistContract from '@DataContracts/Artist/ArtistContract';
import DuplicateEntryResultContract from '@DataContracts/DuplicateEntryResultContract';
import { ArtistAutoCompleteParams } from '@KnockoutExtensions/AutoCompleteParams';
import AlbumRepository from '@Repositories/AlbumRepository';
import ArtistRepository from '@Repositories/ArtistRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import ko from 'knockout';

export default class AlbumCreateViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private albumRepo: AlbumRepository,
		private artistRepo: ArtistRepository,
	) {}

	private addArtist = (artistId?: number): void => {
		if (artistId) {
			this.artistRepo
				.getOne({ id: artistId, lang: this.vocaDbContext.languagePreference })
				.then((artist) => this.artists.push(artist));
		}
	};

	public artists = ko.observableArray<ArtistContract>([]);

	public artistSearchParams: ArtistAutoCompleteParams = {
		acceptSelection: this.addArtist,
	};

	public checkDuplicates = (): void => {
		var term1 = this.nameOriginal();
		var term2 = this.nameRomaji();
		var term3 = this.nameEnglish();

		this.albumRepo
			.findDuplicate({ params: { term1: term1, term2: term2, term3: term3 } })
			.then((result) => {
				this.dupeEntries(result);
			});
	};

	public dupeEntries = ko.observableArray<DuplicateEntryResultContract>([]);

	public nameOriginal = ko.observable('');
	public nameRomaji = ko.observable('');
	public nameEnglish = ko.observable('');

	public removeArtist = (artist: ArtistContract): void => {
		this.artists.remove(artist);
	};

	public submit = (): boolean => {
		this.submitting(true);
		return true;
	};

	public submitting = ko.observable(false);
}
