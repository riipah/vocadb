import AlbumRepository from '@Repositories/AlbumRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import AlbumMergeViewModel from '@ViewModels/Album/AlbumMergeViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const albumRepo = container.get(AlbumRepository);

const AlbumMerge = (model: { id: number }): void => {
	$(function () {
		var vm = new AlbumMergeViewModel(vocaDbContext, albumRepo, model.id);
		ko.applyBindings(vm);

		$('#mergeBtn').click(function () {
			return window.confirm('Are you sure you want to merge the albums?');
		});
	});
};

export default AlbumMerge;
