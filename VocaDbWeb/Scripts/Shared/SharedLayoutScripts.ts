import EntryReportRepository from '@Repositories/EntryReportRepository';
import UserRepository from '@Repositories/UserRepository';
import TopBarViewModel from '@ViewModels/TopBarViewModel';

import ui from './MessagesTyped';
import vdb from './VdbStatic';
import { container } from './inversify.config';

var entryReportRepo = container.get(EntryReportRepository);
var userRepo = container.get(UserRepository);

const SharedLayoutScripts = (model: {
	culture: string;
	entryTypeTranslations: any;
	getNewReportCount: boolean;
	hasUnreadMessages: boolean;
	isLoggedIn: boolean;
	languagePreference: number;
	loggedUserId: number;
	reportSent: any;
	rootPath: string;
	thanksForRating: string;
	topBarData: any;
	uiCulture: string;
	unreadMessagesCount: number;
}): void => {
	var baseAddress = model.rootPath;

	vdb.values = vdb.values || {};
	vdb.values.baseAddress = baseAddress;
	vdb.values.languagePreference = model.languagePreference;
	vdb.values.isLoggedIn = model.isLoggedIn;
	vdb.values.loggedUserId = model.loggedUserId;
	vdb.values.culture = model.culture;
	vdb.values.uiCulture = model.uiCulture;
	vdb.resources = vdb.resources || {};

	vdb.resources.shared = {
		reportSent: model.reportSent,
	};

	ui.initAll(model.thanksForRating);

	var entryTypeTranslations = model.entryTypeTranslations;
	var topBarData = model.topBarData;
	var unreadMessagesCount = model.unreadMessagesCount;
	var getNewReportCount = model.getNewReportCount;

	var topBarViewModel = new TopBarViewModel(
		vdb.values,
		entryTypeTranslations,
		topBarData.searchObjectType,
		'',
		unreadMessagesCount,
		getNewReportCount,
		entryReportRepo,
		userRepo,
	);

	var topBar = $('#topBar')[0];
	if (topBar) {
		ko.applyBindings(topBarViewModel, $('#topBar')[0]);
	}
};

export default SharedLayoutScripts;
