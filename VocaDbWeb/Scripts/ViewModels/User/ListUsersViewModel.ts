import UserApiContract from '@DataContracts/User/UserApiContract';
import ResourcesManager from '@Models/ResourcesManager';
import ResourceRepository from '@Repositories/ResourceRepository';
import UserRepository from '@Repositories/UserRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import ko, { Observable } from 'knockout';

import ServerSidePagingViewModel from '../ServerSidePagingViewModel';

export default class ListUsersViewModel {
	public constructor(
		vocaDbContext: VocaDbContext,
		private readonly repo: UserRepository,
		resourceRepo: ResourceRepository,
		searchTerm: string,
		group: string,
	) {
		if (group) this.group(group);

		this.searchTerm = ko
			.observable(searchTerm || '')
			.extend({ rateLimit: { timeout: 300, method: 'notifyWhenChangesStop' } });

		this.resources = new ResourcesManager(vocaDbContext, resourceRepo);
		this.resources.loadResources(null!, 'userGroupNames');

		this.disabledUsers.subscribe(this.updateResultsWithTotalCount);
		this.group.subscribe(this.updateResultsWithTotalCount);
		this.knowsLanguage.subscribe(this.updateResultsWithTotalCount);
		this.onlyVerifiedArtists.subscribe(this.updateResultsWithTotalCount);
		this.paging.page.subscribe(this.updateResultsWithoutTotalCount);
		this.paging.pageSize.subscribe(this.updateResultsWithTotalCount);
		this.searchTerm.subscribe(this.updateResultsWithTotalCount);
		this.sort.subscribe(this.updateResultsWithoutTotalCount);

		this.updateResults(true);
	}

	public disabledUsers = ko.observable(false);
	public group = ko.observable('Nothing');
	public loading = ko.observable(false);
	public knowsLanguage = ko.observable('');
	public onlyVerifiedArtists = ko.observable(false);
	public page = ko.observableArray<UserApiContract>([]); // Current page of items
	public paging = new ServerSidePagingViewModel(20); // Paging view model
	public pauseNotifications = false;
	public resources: ResourcesManager;
	public searchTerm: Observable<string>;
	public sort = ko.observable('RegisterDate');

	public userGroupName = (userGroup: string): string => {
		return this.resources.resources().userGroupNames != null
			? this.resources.resources().userGroupNames![userGroup]
			: userGroup;
	};

	public updateResultsWithTotalCount = (): void => this.updateResults(true);
	public updateResultsWithoutTotalCount = (): void => this.updateResults(false);

	private updateResults = (clearResults: boolean): void => {
		// Disable duplicate updates
		if (this.pauseNotifications) return;

		this.pauseNotifications = true;

		if (clearResults) this.paging.page(1);

		var pagingProperties = this.paging.getPagingProperties(clearResults);
		this.repo
			.getList({
				paging: pagingProperties,
				query: this.searchTerm(),
				sort: this.sort(),
				groups: this.group(),
				includeDisabled: this.disabledUsers(),
				onlyVerified: this.onlyVerifiedArtists(),
				knowsLanguage: this.knowsLanguage(),
				nameMatchMode: 'Auto',
				fields: 'MainPicture',
			})
			.then((result) => {
				this.pauseNotifications = false;

				this.page(result.items);

				if (pagingProperties.getTotalCount)
					this.paging.totalItems(result.totalCount);
			});
	};
}
