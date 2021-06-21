import AlbumContract from '@DataContracts/Album/AlbumContract';
import AlbumRepository from '@Repositories/AlbumRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import ko from 'knockout';

import ServerSidePagingViewModel from '../ServerSidePagingViewModel';

export default class DeletedAlbumsViewModel {
	public constructor(
		private readonly vocaDbContext: VocaDbContext,
		private albumRepo: AlbumRepository,
	) {
		this.updateResults(true);
		this.paging.page.subscribe(() => this.updateResults(false));
		this.paging.pageSize.subscribe(() => this.updateResults(true));
		this.searchTerm.subscribe(() => this.updateResults(true));
	}

	public discTypeName = (discType: string): string => discType;
	public loading = ko.observable(false);
	public page = ko.observableArray<AlbumContract>([]); // Current page of items
	public paging = new ServerSidePagingViewModel(20); // Paging view model
	public ratingStars = (): any[] => [];
	public searchTerm = ko
		.observable('')
		.extend({ rateLimit: { timeout: 300, method: 'notifyWhenChangesStop' } });
	public showTags = ko.observable(false);
	public sort = ko.observable('Name');
	public viewMode = ko.observable('Details');

	private updateResults = (clearResults: boolean): void => {
		if (clearResults) {
			this.paging.page(1);
		}

		var pagingProperties = this.paging.getPagingProperties(clearResults);
		this.albumRepo
			.getList({
				paging: pagingProperties,
				lang: this.vocaDbContext.languagePreference,
				query: this.searchTerm(),
				sort: 'Name',
				discTypes: undefined,
				tags: undefined,
				childTags: undefined,
				artistIds: undefined,
				artistParticipationStatus: undefined,
				childVoicebanks: undefined,
				includeMembers: undefined,
				fields: 'AdditionalNames,MainPicture',
				status: undefined,
				deleted: true,
				advancedFilters: undefined,
			})
			.then((result) => {
				this.page(result.items);

				if (pagingProperties.getTotalCount)
					this.paging.totalItems(result.totalCount);
			});
	};
}
