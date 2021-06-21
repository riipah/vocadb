import TagRepository from '@Repositories/TagRepository';
import { container } from '@Shared/inversify.config';
import ManageEntryTagMappingsViewModel from '@ViewModels/Admin/ManageEntryTagMappingsViewModel';
import $ from 'jquery';
import ko from 'knockout';

const tagRepo = container.get(TagRepository);

const AdminManageEntryTagMappings = (): void => {
	$(function () {
		ko.punches.enableAll();

		var viewModel = new ManageEntryTagMappingsViewModel(tagRepo);
		ko.applyBindings(viewModel);
	});
};

export default AdminManageEntryTagMappings;
