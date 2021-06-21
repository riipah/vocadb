import ArtistRepository from '@Repositories/ArtistRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import ArtistMergeViewModel from '@ViewModels/Artist/ArtistMergeViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const artistRepo = container.get(ArtistRepository);

const ArtistMerge = (model: { id: number }): void => {
	$(function () {
		var vm = new ArtistMergeViewModel(vocaDbContext, artistRepo, model.id);
		ko.applyBindings(vm);

		$('#mergeBtn').click(function () {
			return window.confirm('Are you sure you want to merge the artists?');
		});
	});
};

export default ArtistMerge;
