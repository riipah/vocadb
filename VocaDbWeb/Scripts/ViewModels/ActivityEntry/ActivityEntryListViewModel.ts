import ActivityEntryContract from '@DataContracts/ActivityEntry/ActivityEntryContract';
import EntryContract from '@DataContracts/EntryContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import ArchivedVersionContract from '@DataContracts/Versioning/ArchivedVersionContract';
import EntryEditEvent from '@Models/ActivityEntries/EntryEditEvent';
import EntryType from '@Models/EntryType';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import ResourcesManager from '@Models/ResourcesManager';
import { ResourceSetNames } from '@Models/ResourcesManager';
import ResourceRepository from '@Repositories/ResourceRepository';
import EntryUrlMapper from '@Shared/EntryUrlMapper';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import $ from 'jquery';
import ko, { Computed, Observable } from 'knockout';
import _ from 'lodash';

enum ActivityEntrySortRule {
	CreateDateDescending,

	CreateDate,
}

export default class ActivityEntryListViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private urlMapper: UrlMapper,
		resourceRepo: ResourceRepository,
		private userId?: number,
		additionsOnly?: boolean,
	) {
		this.additionsOnly = ko.observable(additionsOnly ?? false);
		this.entryType = ko.observable(EntryType[EntryType.Undefined]);
		this.sort = ko.observable(
			ActivityEntrySortRule[ActivityEntrySortRule.CreateDateDescending],
		);

		this.additionsOnly.subscribe(this.clear);
		this.entryType.subscribe(this.clear);
		this.sort.subscribe(this.clear);

		this.resources = new ResourcesManager(vocaDbContext, resourceRepo);
		this.resources.loadResources(
			this.loadMore,
			ResourceSetNames.artistTypeNames,
			ResourceSetNames.discTypeNames,
			ResourceSetNames.songTypeNames,
			ResourceSetNames.userGroupNames,
			ResourceSetNames.activityEntry.activityFeedEventNames,
			ResourceSetNames.album.albumEditableFieldNames,
			ResourceSetNames.artist.artistEditableFieldNames,
			ResourceSetNames.releaseEvent.releaseEventEditableFieldNames,
			ResourceSetNames.song.songEditableFieldNames,
			ResourceSetNames.songList.songListEditableFieldNames,
			ResourceSetNames.songList.songListFeaturedCategoryNames,
			ResourceSetNames.tag.tagEditableFieldNames,
			'activityEntrySortRuleNames',
		);

		this.sortName = ko.computed(() =>
			this.resources.resources().activityEntrySortRuleNames != null
				? this.resources.resources().activityEntrySortRuleNames![this.sort()]
				: '',
		);
	}

	public additionsOnly: Observable<boolean>;

	private clear = (): void => {
		this.lastEntryDate = null!;
		this.entries([]);
		this.loadMore();
	};

	public entries = ko.observableArray<ActivityEntryContract>([]);

	public entryType: Observable<string>;

	public getActivityFeedEventName = (
		activityEntry: ActivityEntryContract,
	): string => {
		var activityFeedEventNames = this.resources.resources()
			.activityEntry_activityFeedEventNames;

		if (
			activityFeedEventNames![
				activityEntry.editEvent + activityEntry.entry.entryType
			]
		) {
			return activityFeedEventNames![
				activityEntry.editEvent + activityEntry.entry.entryType
			];
		} else if (
			activityEntry.editEvent === EntryEditEvent[EntryEditEvent.Created]
		) {
			return activityFeedEventNames!['CreatedNew'].replace(
				'{0}',
				activityFeedEventNames!['Entry' + activityEntry.entry.entryType],
			);
		} else {
			return activityFeedEventNames!['Updated'].replace(
				'{0}',
				activityFeedEventNames!['Entry' + activityEntry.entry.entryType],
			);
		}
	};

	public getChangedFieldNames = (
		entry: EntryContract,
		archivedVersion: ArchivedVersionContract,
	): string | null => {
		if (
			archivedVersion == null ||
			archivedVersion.changedFields == null ||
			archivedVersion.changedFields.length === 0
		)
			return null;

		var sets = this.resources.resources();
		var namesSet: { [key: string]: string };

		switch (EntryType[entry.entryType as keyof typeof EntryType]) {
			case EntryType.Album:
				namesSet = sets.album_albumEditableFieldNames!;
				break;

			case EntryType.Artist:
				namesSet = sets.artist_artistEditableFieldNames!;
				break;

			case EntryType.ReleaseEvent:
				namesSet = sets.releaseEvent_releaseEventEditableFieldNames!;
				break;

			case EntryType.Song:
				namesSet = sets.song_songEditableFieldNames!;
				break;

			case EntryType.SongList:
				namesSet = sets.songList_songListEditableFieldNames!;
				break;

			case EntryType.Tag:
				namesSet = sets.tag_tagEditableFieldNames!;
				break;

			default:
				return archivedVersion.changedFields.join(', ');
		}

		var names = _.map(archivedVersion.changedFields, (f) => namesSet[f]);
		return names.join(', ');
	};

	public getEntryTypeName = (entry: EntryContract): string | null => {
		var sets = this.resources.resources();

		switch (EntryType[entry.entryType as keyof typeof EntryType]) {
			case EntryType.Album:
				return sets.discTypeNames![entry.discType!];

			case EntryType.Artist:
				return sets.artistTypeNames![entry.artistType!];

			case EntryType.Song:
				return sets.songTypeNames![entry.songType!];

			case EntryType.SongList:
				return sets.songList_songListFeaturedCategoryNames![
					entry.songListFeaturedCategory!
				];

			case EntryType.Tag:
				return entry.tagCategoryName!;

			default:
				return null;
		}
	};

	public getEntryUrl = (entry: EntryContract): string => {
		return EntryUrlMapper.details_entry(entry, entry.urlSlug);
	};

	private lastEntryDate!: Date;

	public loadMore = (): void => {
		var url = this.urlMapper.mapRelative('/api/activityEntries');
		var sortRule =
			ActivityEntrySortRule[this.sort() as keyof typeof ActivityEntrySortRule];
		$.getJSON(
			url,
			{
				fields: 'Entry,ArchivedVersion',
				entryFields: 'AdditionalNames,MainPicture',
				lang: ContentLanguagePreference[this.vocaDbContext.languagePreference],
				before:
					sortRule === ActivityEntrySortRule.CreateDateDescending &&
					this.lastEntryDate
						? this.lastEntryDate.toISOString()
						: null,
				since:
					sortRule === ActivityEntrySortRule.CreateDate && this.lastEntryDate
						? this.lastEntryDate.toISOString()
						: null,
				userId: this.userId,
				editEvent: this.additionsOnly() ? EntryEditEvent.Created : null,
				entryType: this.entryType(),
				sortRule: this.sort(),
			},
			(result: PartialFindResultContract<ActivityEntryContract>) => {
				var entries = result.items;

				if (!entries && entries!.length > 0) return;

				ko.utils.arrayPushAll(this.entries, entries);
				this.lastEntryDate = new Date(_.last(entries)!.createDate);
			},
		);
	};

	public resources: ResourcesManager;

	public sort: Observable<string>;
	public sortName: Computed<string>;
}
