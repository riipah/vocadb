import SongApiContract from '@DataContracts/Song/SongApiContract';
import SongContract from '@DataContracts/Song/SongContract';
import SongInListEditContract from '@DataContracts/Song/SongInListEditContract';
import { SongAutoCompleteParams } from '@KnockoutExtensions/AutoCompleteParams';
import EntryType from '@Models/EntryType';
import SongListRepository from '@Repositories/SongListRepository';
import SongRepository from '@Repositories/SongRepository';
import EntryUrlMapper from '@Shared/EntryUrlMapper';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import $ from 'jquery';
import ko, { Observable, ObservableArray } from 'knockout';
import moment from 'moment';

import DeleteEntryViewModel from '../DeleteEntryViewModel';

export class SongInListEditViewModel {
	public constructor(data: SongInListEditContract) {
		this.songInListId = data.songInListId;
		this.notes = ko.observable(data.notes);
		this.order = ko.observable(data.order);
		this.song = data.song;
	}

	public notes: Observable<string>;

	public order: Observable<number>;

	public song: SongApiContract;

	public songInListId: number;
}

export default class SongListEditViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private readonly songListRepo: SongListRepository,
		private readonly songRepo: SongRepository,
		private readonly urlMapper: UrlMapper,
		id: number,
	) {
		this.id = id;
		this.songLinks = ko.observableArray<SongInListEditViewModel>([]);
	}

	private acceptSongSelection = (songId?: number): void => {
		if (!songId) return;

		this.songRepo
			.getOne({ id: songId, lang: this.vocaDbContext.languagePreference })
			.then((song: SongContract) => {
				var songInList = new SongInListEditViewModel({
					songInListId: 0,
					order: 0,
					notes: '',
					song: song,
				});
				this.songLinks.push(songInList);
			});
	};

	public currentName!: string;

	public deleteViewModel = new DeleteEntryViewModel((notes) => {
		this.songListRepo
			.delete({ id: this.id, notes: notes, hardDelete: false })
			.then(this.redirectToDetails);
	});

	public description!: Observable<string>;

	public eventDateDate = ko.observable<Date>();

	public eventDate = ko.computed(() =>
		this.eventDateDate() ? this.eventDateDate()!.toISOString() : null,
	);

	public featuredCategory!: Observable<string>;

	public id: number;

	public init = (loaded: () => void): void => {
		if (this.id) {
			this.songListRepo.getForEdit({ id: this.id }).then((data) => {
				this.currentName = data.name;
				this.name = ko.observable(data.name);
				this.description = ko.observable(data.description);
				this.eventDateDate(
					data.eventDate ? moment(data.eventDate).toDate() : null!,
				); // Assume server date is UTC
				this.featuredCategory = ko.observable(data.featuredCategory);
				this.status = ko.observable(data.status);

				var mappedSongs = $.map(
					data.songLinks,
					(item) => new SongInListEditViewModel(item),
				);
				this.songLinks(mappedSongs);
				loaded();
			});
		} else {
			this.name = ko.observable('');
			this.description = ko.observable('');
			this.featuredCategory = ko.observable('Nothing');
			this.status = ko.observable('Draft');
			loaded();
		}

		this.songLinks.subscribe((links) => {
			for (var track = 0; track < links.length; ++track) {
				links[track].order(track + 1);
			}
		});
	};

	public name!: Observable<string>;

	private redirectToDetails = (): void => {
		window.location.href = this.urlMapper.mapRelative(
			EntryUrlMapper.details(EntryType.SongList, this.id),
		);
	};

	private redirectToRoot = (): void => {
		window.location.href = this.urlMapper.mapRelative('SongList/Featured');
	};

	public removeSong = (songLink: SongInListEditViewModel): void => {
		this.songLinks.remove(songLink);
	};

	public songLinks: ObservableArray<SongInListEditViewModel>;

	public songSearchParams: SongAutoCompleteParams = {
		acceptSelection: this.acceptSongSelection,
	};

	public status!: Observable<string>;

	public submit = (): boolean => {
		this.submitting(true);
		return true;
	};

	public submitting = ko.observable(false);

	public trashViewModel = new DeleteEntryViewModel((notes) => {
		this.songListRepo
			.delete({ id: this.id, notes: notes, hardDelete: true })
			.then(this.redirectToRoot);
	});

	public updateNotes = ko.observable('');
}
