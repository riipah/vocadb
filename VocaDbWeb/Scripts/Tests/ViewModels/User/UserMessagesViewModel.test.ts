import PartialFindResultContract from '@DataContracts/PartialFindResultContract';
import UserApiContract from '@DataContracts/User/UserApiContract';
import UserMessageSummaryContract from '@DataContracts/User/UserMessageSummaryContract';
import { UserInboxType } from '@Repositories/UserRepository';
import VocaDbContext from '@Shared/VocaDbContext';
import { container } from '@Shared/inversify.config';
import UserMessagesViewModel from '@ViewModels/User/UserMessagesViewModel';

import FakeUserRepository from '../../TestSupport/FakeUserRepository';

const vocaDbContext = container.get(VocaDbContext);

var receiver: UserApiContract;
var data: PartialFindResultContract<UserMessageSummaryContract>;
var sender: UserApiContract;
var repository: FakeUserRepository;

var createMessage = (
	id: number,
	subject: string,
	sender?: UserApiContract,
): UserMessageSummaryContract => {
	return {
		createdFormatted: '2039.3.9',
		highPriority: false,
		id: id,
		inbox: 'Received',
		read: false,
		sender: sender,
		receiver: receiver,
		subject: subject,
	};
};

var createViewModel = (): UserMessagesViewModel => {
	return new UserMessagesViewModel(
		vocaDbContext,
		repository,
		UserInboxType.Received,
	);
};

beforeEach(() => {
	receiver = { id: 39, name: 'Rin' };
	sender = { id: 39, name: 'Miku' };
	data = {
		items: [
			createMessage(39, 'New message!', sender),
			createMessage(40, 'Another message!', sender),
		],
		totalCount: 0,
	};

	repository = new FakeUserRepository();
	repository.message = {
		body: 'Message body',
		createdFormatted: null!,
		highPriority: false,
		id: 39,
		inbox: 'Received',
		read: false,
		receiver: null!,
		sender: null!,
		subject: 'New message',
	};
	repository.messages = data.items;
});

test('constructor', () => {
	var viewModel = createViewModel();

	expect(
		viewModel.receivedMessages.items().length,
		'viewModel.receivedMessages.messages().length',
	).toBe(2);
	expect(
		viewModel.receivedMessages.items()[0].subject,
		'viewModel.receivedMessages.messages()[0].subject',
	).toBe('New message!');
	expect(
		viewModel.selectedMessage(),
		'viewModel.selectedMessage()',
	).toBeUndefined();
	expect(
		viewModel.selectedMessageBody(),
		'viewModel.selectedMessageBody()',
	).toBe('');
});

test('selectMessage', () => {
	var viewModel = createViewModel();
	var message = viewModel.receivedMessages.items()[0];

	expect(message, 'message').toBeTruthy();

	viewModel.selectMessage(message);

	expect(
		viewModel.selectedMessage(),
		'viewModel.selectedMessage()',
	).toBeTruthy();
	expect(
		viewModel.selectedMessage()!.subject,
		'viewModel.selectedMessage().subject',
	).toBe('New message!');
	expect(
		viewModel.selectedMessageBody(),
		'viewModel.selectedMessageBody()',
	).toBe('Message body');
	expect(message.selected(), 'message.selected()').toBe(true);
});

test('selectMessage deselectes others', () => {
	var viewModel = createViewModel();
	var message1 = viewModel.receivedMessages.items()[0];
	var message2 = viewModel.receivedMessages.items()[1];

	expect(message1, 'message1').toBeTruthy();
	expect(message2, 'message2').toBeTruthy();

	viewModel.selectMessage(message1);
	viewModel.selectMessage(message2);

	expect(
		viewModel.selectedMessage(),
		'viewModel.selectedMessage()',
	).toBeTruthy();
	expect(
		viewModel.selectedMessage()!.subject,
		'viewModel.selectedMessage().subject',
	).toBe('Another message!');
	expect(message1.selected(), 'message1.selected()').toBe(false);
	expect(message2.selected(), 'message2.selected()').toBe(true);
});
