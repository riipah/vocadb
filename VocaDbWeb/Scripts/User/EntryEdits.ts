import ResourceRepository from '@Repositories/ResourceRepository';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ActivityEntryListViewModel from '@ViewModels/ActivityEntry/ActivityEntryListViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const resourceRepo = container.get(ResourceRepository);

const UserEntryEdits = (
	additionsOnly: boolean,
	model: {
		id: number;
	},
): void => {
	$(function () {
		moment.locale(vocaDbContext.culture);
		ko.punches.enableAll();

		var urlMapper = new UrlMapper(vocaDbContext.baseAddress);
		var userId = model.id;

		var vm = new ActivityEntryListViewModel(
			vocaDbContext,
			urlMapper,
			resourceRepo,
			userId,
			additionsOnly,
		);
		ko.applyBindings(vm);
	});
};

export default UserEntryEdits;
