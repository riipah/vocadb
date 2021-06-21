import AdminRepository from '@Repositories/AdminRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ManageIPRulesViewModel, {
	IPRuleContract,
} from '@ViewModels/Admin/ManageIPRulesViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const adminRepo = container.get(AdminRepository);

const AdminManageIPRules = (model: IPRuleContract[]): void => {
	$(function () {
		moment.locale(vocaDbContext.culture);
		ko.punches.enableAll();

		var rules = model;

		var viewModel = new ManageIPRulesViewModel(rules, adminRepo);
		ko.applyBindings(viewModel);
	});
};

export default AdminManageIPRules;
