import ArtistContract from '@DataContracts/Artist/ArtistContract';
import ArtistForAlbumContract from '@DataContracts/ArtistForAlbumContract';
import DuplicateEntryResultContract from '@DataContracts/DuplicateEntryResultContract';
import SongContract from '@DataContracts/Song/SongContract';
import TagApiContract from '@DataContracts/Tag/TagApiContract';
import SongHelper from '@Helpers/SongHelper';
import { ArtistAutoCompleteParams } from '@KnockoutExtensions/AutoCompleteParams';
import { SongAutoCompleteParams } from '@KnockoutExtensions/AutoCompleteParams';
import ArtistRoles from '@Models/Artists/ArtistRoles';
import ArtistType from '@Models/Artists/ArtistType';
import EntryType from '@Models/EntryType';
import SongType from '@Models/Songs/SongType';
import ArtistRepository from '@Repositories/ArtistRepository';
import SongRepository from '@Repositories/SongRepository';
import TagRepository from '@Repositories/TagRepository';
import EntryUrlMapper from '@Shared/EntryUrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Computed } from 'knockout';
import _ from 'lodash';

import BasicEntryLinkViewModel from './BasicEntryLinkViewModel';

// View model for song creation view
export default class SongCreateViewModel {
	public addArtist: (artistId?: number) => void;

	public artistSearchParams: ArtistAutoCompleteParams;

	public artists = ko.observableArray<ArtistContract>([]);

	public artistsWithRoles: Computed<ArtistForAlbumContract[]> = ko.computed(
		() =>
			_.map(this.artists(), (a) => {
				return { artist: a, roles: ArtistRoles[ArtistRoles.Default] };
			}),
	);

	private getArtistIds = (): number[] => {
		return _.map(this.artists(), (a) => a.id);
	};

	public checkDuplicatesAndPV = (
		vm?: undefined,
		event?: JQueryEventObject,
	): void => {
		this.checkDuplicates(vm, event, true);
	};

	public checkDuplicates = (
		vm?: undefined,
		event?: JQueryEventObject,
		getPVInfo = false,
	): boolean => {
		var term1 = this.nameOriginal();
		var term2 = this.nameRomaji();
		var term3 = this.nameEnglish();
		var pv1 = this.pv1();
		var pv2 = this.pv2();
		var artists = this.getArtistIds();

		this.songRepository
			.findDuplicate({
				params: {
					term: [term1, term2, term3],
					pv: [pv1, pv2],
					artistIds: artists,
					getPVInfo: getPVInfo,
				},
			})
			.then((result) => {
				this.dupeEntries(result.matches);

				if (result.title && !this.hasName()) {
					if (result.titleLanguage === 'English') {
						this.nameEnglish(result.title);
					} else {
						this.nameOriginal(result.title);
					}
				}

				if (
					result.songType &&
					result.songType !== 'Unspecified' &&
					this.songType() === 'Original'
				) {
					this.songType(result.songType);
				}

				if (result.artists && this.artists().length === 0) {
					_.forEach(result.artists, (artist) => {
						this.artists.push(artist);
					});
				}
			});

		if (event) event.preventDefault();

		return false;
	};

	private getSongTypeTag = async (songType: string): Promise<void> => {
		const tag = await this.tagRepository.getEntryTypeTag({
			entryType: EntryType.Song,
			subType: songType,
			lang: this.vocaDbContext.languagePreference,
		});
		this.songTypeTag(tag);
	};

	public dupeEntries = ko.observableArray<DuplicateEntryResultContract>([]);

	public isDuplicatePV: Computed<boolean>;

	public nameOriginal = ko.observable('');
	public nameRomaji = ko.observable('');
	public nameEnglish = ko.observable('');

	public originalSongSuggestions: Computed<DuplicateEntryResultContract[]>;

	public originalVersion: BasicEntryLinkViewModel<SongContract>;
	public originalVersionSearchParams: SongAutoCompleteParams;

	public pv1 = ko.observable('');
	public pv2 = ko.observable('');
	public songType = ko.observable('Original');
	public songTypeTag = ko.observable<TagApiContract>(null!);
	public songTypeName = ko.computed(() => this.songTypeTag()?.name);
	public songTypeInfo = ko.computed(() => this.songTypeTag()?.description);
	public songTypeTagUrl = ko.computed(() =>
		EntryUrlMapper.details_tag_contract(this.songTypeTag()!),
	);

	public coverArtists: Computed<ArtistContract[]>;

	public canHaveOriginalVersion = ko.computed(
		() =>
			SongType[this.songType() as keyof typeof SongType] !== SongType.Original,
	);

	public hasName: Computed<boolean>;

	public selectOriginal = (dupe: DuplicateEntryResultContract): void => {
		this.songRepository
			.getOne({
				id: dupe.entry.id,
				lang: this.vocaDbContext.languagePreference,
			})
			.then((song) => this.originalVersion.entry(song));
	};

	public submit = (): boolean => {
		this.submitting(true);
		return true;
	};

	public submitting = ko.observable(false);

	public removeArtist: (artist: ArtistContract) => void;

	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private readonly songRepository: SongRepository,
		artistRepository: ArtistRepository,
		private readonly tagRepository: TagRepository,
		data?: {
			nameEnglish: string;
			artists: ArtistContract[];
			nameOriginal?: string;
			nameRomaji?: string;
			pvUrl?: string;
			reprintPVUrl?: string;
		},
	) {
		if (data) {
			this.nameOriginal(data.nameOriginal || '');
			this.nameRomaji(data.nameRomaji || '');
			this.nameEnglish(data.nameEnglish || '');
			this.pv1(data.pvUrl || '');
			this.pv2(data.reprintPVUrl || '');
			this.artists(data.artists || []);
		}

		this.addArtist = (artistId?: number): void => {
			if (artistId) {
				artistRepository
					.getOne({ id: artistId, lang: vocaDbContext.languagePreference })
					.then((artist) => {
						this.artists.push(artist);
						this.checkDuplicates();
					});
			}
		};

		this.artistSearchParams = {
			acceptSelection: this.addArtist,
			height: 300,
		};

		this.hasName = ko.computed(() => {
			return (
				this.nameOriginal().length > 0 ||
				this.nameRomaji().length > 0 ||
				this.nameEnglish().length > 0
			);
		});

		this.isDuplicatePV = ko.computed(() => {
			return _.some(this.dupeEntries(), (item) => {
				return item.matchProperty === 'PV';
			});
		});

		this.originalVersion = new BasicEntryLinkViewModel<SongContract>(
			null!,
			(entryId, callback) =>
				songRepository
					.getOne({ id: entryId, lang: vocaDbContext.languagePreference })
					.then(callback),
		);

		this.originalVersionSearchParams = {
			acceptSelection: this.originalVersion.id,
			extraQueryParams: { songTypes: SongHelper.originalVersionTypesString() },
		};

		this.originalSongSuggestions = ko.computed(() => {
			if (!this.dupeEntries() || this.dupeEntries().length === 0) return [];

			return _.take(this.dupeEntries(), 3);
		});

		this.removeArtist = (artist: ArtistContract): void => {
			this.artists.remove(artist);
		};

		if (this.pv1()) {
			this.checkDuplicatesAndPV();
		}

		this.songType.subscribe(this.getSongTypeTag);
		this.getSongTypeTag(this.songType());

		this.coverArtists = ko.computed(() => {
			return _.filter(
				this.artists(),
				(a) =>
					ArtistType[a.artistType as keyof typeof ArtistType] ===
					ArtistType.CoverArtist,
			);
		});
	}
}
