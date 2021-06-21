import TagRepository from '@Repositories/TagRepository';
import { container } from '@Shared/inversify.config';
import TagCreateViewModel from '@ViewModels/Tag/TagCreateViewModel';
import $ from 'jquery';
import ko from 'knockout';

const tagRepo = container.get(TagRepository);

const TagIndex = (): void => {
	$(function () {
		var viewModel = new TagCreateViewModel(tagRepo);
		ko.applyBindings(viewModel);
	});
};

export default TagIndex;
