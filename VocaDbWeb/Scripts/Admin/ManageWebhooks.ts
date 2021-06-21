import AdminRepository from '@Repositories/AdminRepository';
import { container } from '@Shared/inversify.config';
import ManageWebhooksViewModel from '@ViewModels/Admin/ManageWebhooksViewModel';
import $ from 'jquery';
import ko from 'knockout';

const adminRepo = container.get(AdminRepository);

const AdminManageWebhooks = (webhookEventNames: {
	[key: string]: string;
}): void => {
	$(function () {
		var viewModel = new ManageWebhooksViewModel(webhookEventNames, adminRepo);
		ko.applyBindings(viewModel);
	});
};

export default AdminManageWebhooks;
