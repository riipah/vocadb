import ArtistRepository from '@Repositories/ArtistRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import RequestVerificationViewModel from '@ViewModels/User/RequestVerificationViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const artistRepo = container.get(ArtistRepository);

const UserRequestVerification = (): void => {
	$(document).ready(function () {
		ko.applyBindings(
			new RequestVerificationViewModel(vocaDbContext, artistRepo),
		);
	});
};

export default UserRequestVerification;
