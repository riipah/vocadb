import SongRepository from '@Repositories/SongRepository';
import UserRepository from '@Repositories/UserRepository';
import UrlMapper from '@Shared/UrlMapper';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import RankingsViewModel from '@ViewModels/Song/RankingsViewModel';
import $ from 'jquery';
import ko from 'knockout';
import moment from 'moment';

const vocaDbContext = container.get(VocaDbContext);
const songRepo = container.get(SongRepository);
const userRepo = container.get(UserRepository);

const SongRankings = (): void => {
	moment.locale(vocaDbContext.culture);
	ko.punches.enableAll();

	$(function () {
		var urlMapper = new UrlMapper(vocaDbContext.baseAddress);
		var viewModel = new RankingsViewModel(
			urlMapper,
			songRepo,
			userRepo,
			vocaDbContext.languagePreference,
		);
		ko.applyBindings(viewModel);
	});
};

export default SongRankings;
