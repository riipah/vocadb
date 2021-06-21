import TagBaseContract from '@DataContracts/Tag/TagBaseContract';
import TagRepository from '@Repositories/TagRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Computed, Observable, ObservableArray } from 'knockout';
import _ from 'lodash';

import TagFilter from './TagFilter';

// Manages tag filters for search
export default class TagFilters {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private tagRepo: TagRepository,
		tags: ObservableArray<TagFilter> = null!,
	) {
		this.tags = tags || ko.observableArray<TagFilter>();
		this.tagIds = ko.computed(() => _.map(this.tags(), (t) => t.id));
		this.childTags = ko.observable(false);

		this.filters = ko
			.computed(() => {
				this.tags();
				this.childTags();
			})
			.extend({ notify: 'always' });
	}

	public addTag = (tag: TagBaseContract): number =>
		this.tags.push(TagFilter.fromContract(tag));

	public addTags = (selectedTagIds: number[]): void => {
		if (!selectedTagIds) return;

		var filters = _.map(selectedTagIds, (a) => new TagFilter(a));
		ko.utils.arrayPushAll(this.tags, filters);

		if (!this.tagRepo) return;

		_.forEach(filters, (newTag) => {
			var selectedTagId = newTag.id;

			this.tagRepo
				.getById({
					id: selectedTagId,
					fields: undefined,
					lang: this.vocaDbContext.languagePreference,
				})
				.then((tag) => {
					newTag.name(tag.name);
					newTag.urlSlug(tag.urlSlug!);
				});
		});
	};

	public childTags: Observable<boolean>;

	// Fired when any of the tag filters is changed
	public filters: Computed<void>;

	public selectTag = (tag: TagBaseContract): void => {
		this.tags([TagFilter.fromContract(tag)]);
	};

	public tags: ObservableArray<TagFilter>;
	public tagIds: Computed<number[]>;
}
