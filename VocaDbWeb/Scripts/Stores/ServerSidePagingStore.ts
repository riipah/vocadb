import _ from 'lodash';
import { action, computed, makeObservable, observable } from 'mobx';

export default class ServerSidePagingStore {
	@observable public page = 1;
	@action public setPage = (value: number): void => {
		this.page = value;
	};

	@observable public totalItems = 0;
	@action public setTotalItems = (value: number): void => {
		this.totalItems = value;
	};

	@observable public pageSize = 10;
	@action public setPageSize = (value: number): void => {
		this.pageSize = value;
	};

	public constructor() {
		makeObservable(this);
	}

	@computed public get firstItem(): number {
		return (this.page - 1) * this.pageSize;
	}

	@computed public get totalPages(): number {
		return Math.ceil(this.totalItems / this.pageSize);
	}

	@computed public get isFirstPage(): boolean {
		return this.page <= 1;
	}

	@computed public get isLastPage(): boolean {
		return this.page >= this.totalPages;
	}

	@computed public get pages(): number[] {
		const start = Math.max(this.page - 4, 1);
		const end = Math.min(this.page + 4, this.totalPages);

		return _.range(start, end + 1);
	}

	@computed public get showMoreBegin(): boolean {
		return this.page > 5;
	}

	@computed public get showMoreEnd(): boolean {
		return this.page < this.totalPages - 4;
	}

	public getPagingProperties = (
		clearResults: boolean = false,
	): { start: number; maxEntries: number; getTotalCount: boolean } => {
		return {
			start: this.firstItem,
			maxEntries: this.pageSize,
			getTotalCount: clearResults || this.totalItems === 0,
		};
	};

	@action public goToFirstPage = (): void => {
		this.page = 1;
	};

	@action public goToLastPage = (): void => {
		this.page = this.totalPages;
	};

	@action public nextPage = (): void => {
		if (!this.isLastPage) this.page = this.page + 1;
	};

	@action public previousPage = (): void => {
		if (!this.isFirstPage) this.page = this.page - 1;
	};
}
