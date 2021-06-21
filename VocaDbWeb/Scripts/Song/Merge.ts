import SongContract from '@DataContracts/Song/SongContract';
import SongRepository from '@Repositories/SongRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import SongMergeViewModel from '@ViewModels/Song/SongMergeViewModel';
import $ from 'jquery';
import ko from 'knockout';

const vocaDbContext = container.get(VocaDbContext);
const songRepo = container.get(SongRepository);

const SongMerge = (model: SongContract): void => {
	$(function () {
		var data = model;
		var vm = new SongMergeViewModel(vocaDbContext, songRepo, data);
		ko.applyBindings(vm);

		$('#mergeBtn').click(function () {
			return window.confirm('Are you sure you want to merge the songs?');
		});
	});
};

export default SongMerge;
