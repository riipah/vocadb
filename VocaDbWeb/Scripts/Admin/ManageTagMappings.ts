import TagRepository from '@Repositories/TagRepository';
import { container } from '@Shared/inversify.config';
import ManageTagMappingsViewModel from '@ViewModels/Admin/ManageTagMappingsViewModel';
import $ from 'jquery';
import ko from 'knockout';

const tagRepo = container.get(TagRepository);

const AdminManageTagMappings = (): void => {
	$(function () {
		ko.punches.enableAll();

		var viewModel = new ManageTagMappingsViewModel(tagRepo);
		ko.applyBindings(viewModel);
	});
};

export default AdminManageTagMappings;
