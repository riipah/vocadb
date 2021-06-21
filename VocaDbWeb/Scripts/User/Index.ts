import ResourceRepository from '@Repositories/ResourceRepository';
import UserRepository from '@Repositories/UserRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ListUsersViewModel from '@ViewModels/User/ListUsersViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const userRepo = container.get(UserRepository);
const resourceRepo = container.get(ResourceRepository);

const UserIndex = (model: { filter: string; groupId: string }): void => {
	$(function () {
		moment.locale(vocaDbContext.culture);

		var filter = model.filter;
		var groupId = model.groupId;
		var viewModel = new ListUsersViewModel(
			vocaDbContext,
			userRepo,
			resourceRepo,
			filter,
			groupId,
		);
		ko.applyBindings(viewModel);
	});
};

export default UserIndex;
