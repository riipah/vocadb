import UserKnownLanguageContract from '@DataContracts/User/UserKnownLanguageContract';
import WebLinkContract from '@DataContracts/WebLinkContract';
import UserRepository from '@Repositories/UserRepository';
import { container } from '@Shared/inversify.config';
import MySettingsViewModel from '@ViewModels/User/MySettingsViewModel';
import $ from 'jquery';
import ko from 'knockout';

const userRepo = container.get(UserRepository);

const UserMySettings = (model: {
	aboutMe: string;
	email: string;
	emailVerified: boolean;
	knownLanguages: UserKnownLanguageContract[];
	webLinks: WebLinkContract[];
}): void => {
	$(document).ready(function () {
		$('#tabs').tabs();

		var viewModel = new MySettingsViewModel(
			userRepo,
			model.aboutMe,
			model.email,
			model.emailVerified,
			model.webLinks,
			model.knownLanguages,
		);
		ko.applyBindings(viewModel);
	});
};

export default UserMySettings;
