import CommentContract from '@DataContracts/CommentContract';
import EntryContract from '@DataContracts/EntryContract';
import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import EntryType from '@Models/EntryType';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import ResourcesManager, { ResourceSetNames } from '@Models/ResourcesManager';
import ResourceRepository from '@Repositories/ResourceRepository';
import EntryUrlMapper from '@Shared/EntryUrlMapper';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import $ from 'jquery';
import ko, { Computed, Observable } from 'knockout';
import _ from 'lodash';

enum CommentSortRule {
	CreateDateDescending,

	CreateDate,
}

export default class CommentListViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private urlMapper: UrlMapper,
		resourceRepo: ResourceRepository,
		private userId?: number,
	) {
		this.entryType = ko.observable(EntryType[EntryType.Undefined]);
		this.sort = ko.observable(
			CommentSortRule[CommentSortRule.CreateDateDescending],
		);

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
			'commentSortRuleNames',
		);

		this.sortName = ko.computed(() =>
			this.resources.resources().commentSortRuleNames != null
				? this.resources.resources().commentSortRuleNames![this.sort()]
				: '',
		);
	}

	private clear = (): void => {
		this.lastCommentDate = null!;
		this.comments([]);
		this.loadMore();
	};

	public comments = ko.observableArray<CommentContract>([]);

	public entryType: Observable<string>;

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

	private lastCommentDate!: Date;

	public loadMore = (): void => {
		var url = this.urlMapper.mapRelative('/api/comments');
		var sortRule = CommentSortRule[this.sort() as keyof typeof CommentSortRule];
		$.getJSON(
			url,
			{
				fields: 'Entry',
				entryFields: 'AdditionalNames,MainPicture',
				lang: ContentLanguagePreference[this.vocaDbContext.languagePreference],
				before:
					sortRule === CommentSortRule.CreateDateDescending &&
					this.lastCommentDate
						? this.lastCommentDate.toISOString()
						: null,
				since:
					sortRule === CommentSortRule.CreateDate && this.lastCommentDate
						? this.lastCommentDate.toISOString()
						: null,
				userId: this.userId,
				entryType: this.entryType(),
				sortRule: this.sort(),
			},
			(result: PartialFindResultContract<CommentContract>) => {
				var entries = result.items;

				if (!entries && entries!.length > 0) return;

				ko.utils.arrayPushAll(this.comments, entries);
				this.lastCommentDate = new Date(_.last(entries)!.created!);
			},
		);
	};

	public resources: ResourcesManager;

	public sort: Observable<string>;
	public sortName: Computed<string>;
}
