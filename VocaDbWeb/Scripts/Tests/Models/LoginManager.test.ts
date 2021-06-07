import UserWithPermissionsContract from '@DataContracts/User/UserWithPermissionsContract';
import LoginManager, { PermissionToken } from '@Models/LoginManager';
import GlobalValues from '@Shared/GlobalValues';
import _ from 'lodash';

var effectivePermissions: PermissionToken[];

beforeEach(() => {
	effectivePermissions = [
		PermissionToken.EditProfile,
		PermissionToken.CreateComments,
		PermissionToken.ManageDatabase,
		PermissionToken.EditTags,
		PermissionToken.ReportUser,
		PermissionToken.ManageEventSeries,
	];
});

const createValues = (
	loggedUser?: UserWithPermissionsContract,
	lockdownMessage?: string,
): GlobalValues => {
	return {
		...vdb.values,
		isLoggedIn: !!loggedUser,
		loggedUser,
		lockdownMessage,
	};
};

const testHasPermission = (
	loginManager: LoginManager,
	tokens: PermissionToken[],
): void => {
	_.forEach(tokens, (token) => {
		const result = loginManager.hasPermission(token);
		expect(result).toBe(true);
	});

	_.xor(Object.values(PermissionToken), tokens).forEach((token) => {
		const result = loginManager.hasPermission(token);
		expect(result).toBe(false);
	});
};

test('hasPermission guest', () => {
	const loginManager = new LoginManager(createValues());
	testHasPermission(loginManager, [PermissionToken.Nothing]);
});

test('hasPermission disabled user', () => {
	const loginManager = new LoginManager(
		createValues({
			id: 1,
			name: 'Disabled user',
			active: false,
			effectivePermissions,
			unreadMessagesCount: 0,
		}),
	);
	testHasPermission(loginManager, [PermissionToken.Nothing]);
});

test('hasPermission regular user', () => {
	const loginManager = new LoginManager(
		createValues({
			id: 39,
			name: 'Regular user',
			active: true,
			effectivePermissions,
			unreadMessagesCount: 0,
		}),
	);
	testHasPermission(loginManager, [
		PermissionToken.Nothing,
		...effectivePermissions,
	]);
});

test('hasPermission regular user with lockdown message', () => {
	const loginManager = new LoginManager(
		createValues(
			{
				id: 39,
				name: 'Regular user',
				active: true,
				effectivePermissions,
				unreadMessagesCount: 0,
			},
			'lockdown!',
		),
	);
	testHasPermission(loginManager, [
		PermissionToken.Nothing,
		..._.difference(effectivePermissions, [PermissionToken.ManageDatabase]),
	]);
});
