import ArtistForEventContract from '@DataContracts/ReleaseEvents/ArtistForEventContract';
import ReleaseEventContract from '@DataContracts/ReleaseEvents/ReleaseEventContract';
import SongListBaseContract from '@DataContracts/SongListBaseContract';
import VenueForApiContract from '@DataContracts/Venue/VenueForApiContract';
import EntryType from '@Models/EntryType';
import ArtistEventRoles from '@Models/Events/ArtistEventRoles';
import IEntryWithIdAndName from '@Models/IEntryWithIdAndName';
import ArtistRepository from '@Repositories/ArtistRepository';
import PVRepository from '@Repositories/PVRepository';
import ReleaseEventRepository from '@Repositories/ReleaseEventRepository';
import UserRepository from '@Repositories/UserRepository';
import EntryUrlMapper from '@Shared/EntryUrlMapper';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Computed, Observable, ObservableArray } from 'knockout';
import _ from 'lodash';
import moment from 'moment';

import { AlbumArtistRolesEditViewModel } from '../Artist/ArtistRolesEditViewModel';
import ArtistRolesEditViewModel from '../Artist/ArtistRolesEditViewModel';
import BasicEntryLinkViewModel from '../BasicEntryLinkViewModel';
import DeleteEntryViewModel from '../DeleteEntryViewModel';
import NamesEditViewModel from '../Globalization/NamesEditViewModel';
import PVListEditViewModel from '../PVs/PVListEditViewModel';
import ArtistForEventEditViewModel from '../ReleaseEvent/ArtistForEventEditViewModel';
import WebLinksEditViewModel from '../WebLinksEditViewModel';

export default class ReleaseEventEditViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private readonly repo: ReleaseEventRepository,
		userRepository: UserRepository,
		pvRepository: PVRepository,
		private readonly artistRepository: ArtistRepository,
		private readonly urlMapper: UrlMapper,
		private readonly artistRoleNames: { [key: string]: string },
		contract: ReleaseEventContract,
	) {
		this.artistRolesEditViewModel = new AlbumArtistRolesEditViewModel(
			artistRoleNames,
		);
		this.artistLinks = ko.observableArray(
			_.map(
				contract.artists,
				(artist) => new ArtistForEventEditViewModel(artist),
			),
		);
		this.id = contract.id;
		this.date = ko.observable(
			contract.date ? moment(contract.date).toDate() : null!,
		);
		this.dateStr = ko.computed(() =>
			this.date() ? this.date().toISOString() : null!,
		);
		this.endDate = ko.observable(
			contract.endDate ? moment(contract.endDate).toDate() : null!,
		);
		this.endDateStr = ko.computed(() =>
			this.endDate() ? this.endDate().toISOString() : null!,
		);

		this.defaultNameLanguage = ko.observable(contract.defaultNameLanguage);
		this.names = NamesEditViewModel.fromContracts(contract.names!);
		this.pvs = new PVListEditViewModel(
			pvRepository,
			urlMapper,
			contract.pvs!,
			false,
			true,
			false,
		);
		this.series = new BasicEntryLinkViewModel(contract.series, null!);
		this.isSeriesEvent = ko.observable(!this.series.isEmpty());

		this.isSeriesEventStr = ko.computed<string>({
			read: () => (this.isSeriesEvent() ? 'true' : 'false'),
			write: (val) => this.isSeriesEvent(val === 'true'),
		});

		this.isSeriesEvent.subscribe((val) => {
			if (!val) this.series.clear();
		});

		this.songList = new BasicEntryLinkViewModel(contract.songList, null!);
		this.venue = new BasicEntryLinkViewModel(contract.venue, null!);
		this.webLinks = new WebLinksEditViewModel(contract.webLinks);

		this.artistLinkContracts = ko.computed<ArtistForEventContract[]>(() =>
			ko.toJS(this.artistLinks()),
		);

		if (contract.id) {
			window.setInterval(
				() =>
					userRepository.refreshEntryEdit({
						entryType: EntryType.ReleaseEvent,
						entryId: contract.id,
					}),
				10000,
			);
		}
	}

	public addArtist = (artistId?: number, customArtistName?: string): void => {
		if (artistId) {
			this.artistRepository
				.getOne({ id: artistId, lang: this.vocaDbContext.languagePreference })
				.then((artist) => {
					const data: ArtistForEventContract = {
						artist: artist,
						name: artist.name,
						id: 0,
						roles: 'Default',
					};

					const link = new ArtistForEventEditViewModel(data);
					this.artistLinks.push(link);
				});
		} else {
			const data: ArtistForEventContract = {
				artist: null!,
				name: customArtistName,
				id: 0,
				roles: 'Default',
			};

			const link = new ArtistForEventEditViewModel(data);
			this.artistLinks.push(link);
		}
	};

	public artistLinks: ObservableArray<ArtistForEventEditViewModel>;

	public artistLinkContracts: Computed<ArtistForEventContract[]>;

	public artistRolesEditViewModel: EventArtistRolesEditViewModel;

	public artistSearchParams = {
		createNewItem: "Add custom artist named '{0}'",
		acceptSelection: this.addArtist,
	};

	public customName = ko.observable(false);

	// Event date. This should always be in UTC.
	public date: Observable<Date>;

	// Date as ISO string, in UTC, ready to be posted to server
	public dateStr: Computed<string>;

	public defaultNameLanguage: Observable<string>;

	public deleteViewModel = new DeleteEntryViewModel((notes) => {
		this.repo
			.delete({ id: this.id, notes: notes, hardDelete: false })
			.then(this.redirectToDetails);
	});

	public description = ko.observable<string>();

	public editArtistRoles = (artist: ArtistForEventEditViewModel): void => {
		this.artistRolesEditViewModel.show(artist);
	};

	public endDate: Observable<Date>;

	public endDateStr: Computed<string>;

	private id: number;

	public isSeriesEvent: Observable<boolean>;

	public isSeriesEventStr: Computed<string>;

	public names: NamesEditViewModel;
	public pvs: PVListEditViewModel;

	private redirectToDetails = (): void => {
		window.location.href = this.urlMapper.mapRelative(
			EntryUrlMapper.details(EntryType.ReleaseEvent, this.id),
		);
	};

	private redirectToRoot = (): void => {
		window.location.href = this.urlMapper.mapRelative('Event');
	};

	public removeArtist = (artist: ArtistForEventEditViewModel): void => {
		this.artistLinks.remove(artist);
	};

	public series: BasicEntryLinkViewModel<IEntryWithIdAndName>;

	public songList: BasicEntryLinkViewModel<SongListBaseContract>;

	public submit = (): boolean => {
		this.submitting(true);
		return true;
	};

	public submitting = ko.observable(false);

	public translateArtistRole = (role: string): string => {
		return this.artistRoleNames[role];
	};

	public trashViewModel = new DeleteEntryViewModel((notes) => {
		this.repo
			.delete({ id: this.id, notes: notes, hardDelete: true })
			.then(this.redirectToRoot);
	});

	public venue: BasicEntryLinkViewModel<VenueForApiContract>;

	public webLinks: WebLinksEditViewModel;
}

export class EventArtistRolesEditViewModel extends ArtistRolesEditViewModel {
	public constructor(roleNames: { [key: string]: string }) {
		super(roleNames, ArtistEventRoles[ArtistEventRoles.Default]);
	}
}
