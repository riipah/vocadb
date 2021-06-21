import TagBaseContract from '@DataContracts/Tag/TagBaseContract';
import TagRepository from '@Repositories/TagRepository';
import { container } from '@Shared/inversify.config';
import TagMergeViewModel from '@ViewModels/Tag/TagMergeViewModel';
import $ from 'jquery';
import ko from 'knockout';

const tagRepo = container.get(TagRepository);

const TagMerge = (model: TagBaseContract): void => {
	$(function () {
		var data = model;
		var vm = new TagMergeViewModel(tagRepo, data);
		ko.applyBindings(vm);

		$('#mergeBtn').click(function () {
			return window.confirm('Are you sure you want to merge the tags?');
		});
	});
};

export default TagMerge;
