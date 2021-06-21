import ArtistRepository from '@Repositories/ArtistRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import SongRepository from '@Repositories/SongRepository';
import TagRepository from '@Repositories/TagRepository';
import UserRepository from '@Repositories/UserRepository';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import PVPlayersFactory from '@ViewModels/PVs/PVPlayersFactory';
import RatedSongsSearchViewModel from '@ViewModels/User/RatedSongsSearchViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const userRepo = container.get(UserRepository);
const artistRepo = container.get(ArtistRepository);
const songRepo = container.get(SongRepository);
const resourceRepo = container.get(ResourceRepository);
const tagRepo = container.get(TagRepository);

const UserFavoriteSongs = (model: {
	groupByRating: boolean;
	sort: string;
	user: {
		id: number;
	};
}): void => {
	$(function () {
		moment.locale(vocaDbContext.culture);
		var loggedUserId = model.user.id;
		var sort = model.sort;
		var groupByRating = model.groupByRating;

		var rootPath = vocaDbContext.baseAddress;
		var urlMapper = new UrlMapper(rootPath);
		var pvPlayersFactory = new PVPlayersFactory($('#pv-player-wrapper')[0]);

		var vm = new RatedSongsSearchViewModel(
			vocaDbContext,
			urlMapper,
			userRepo,
			artistRepo,
			songRepo,
			resourceRepo,
			tagRepo,
			loggedUserId,
			sort,
			groupByRating,
			pvPlayersFactory,
			true,
		);
		ko.applyBindings(vm);
	});
};

export default UserFavoriteSongs;
