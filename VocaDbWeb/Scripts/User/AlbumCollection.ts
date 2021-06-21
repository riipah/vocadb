import ArtistRepository from '@Repositories/ArtistRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import UserRepository from '@Repositories/UserRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import AlbumCollectionViewModel from '@ViewModels/User/AlbumCollectionViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const userRepo = container.get(UserRepository);
const artistRepo = container.get(ArtistRepository);
const resourceRepo = container.get(ResourceRepository);

const UserAlbumCollection = (
	model: {
		user: {
			id: number;
		};
	},
	publicCollection: boolean,
): void => {
	$(document).ready(function () {
		var loggedUserId = model.user.id;

		var vm = new AlbumCollectionViewModel(
			vocaDbContext,
			userRepo,
			artistRepo,
			resourceRepo,
			loggedUserId,
			publicCollection,
		);
		ko.applyBindings(vm);
	});
};

export default UserAlbumCollection;
