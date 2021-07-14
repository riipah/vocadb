import UserWithPermissionsContract from '@DataContracts/User/UserWithPermissionsContract';
import GlobalValues from '@Shared/GlobalValues';

// Corresponds to the PermissionToken struct in C#.
export enum PermissionToken {
	Nothing = '00000000-0000-0000-0000-000000000000',
	AccessManageMenu = 'b54de61d-9341-4435-8cb1-31e5e295d577',
	AddRawFileMedia = '9c1992d8-3fca-4008-b248-7d7f2a7f15dc',
	Admin = '1c98077f-f36f-4ef2-8cf3-cd9e347d389a',
	ApplyAnyTag = '100e81ce-6bc9-4083-bff4-2a47fcfb37d3',
	ApproveEntries = 'e3b4b909-5128-4a0e-9f26-2bf1d5e497ab',
	BulkDeletePVs = 'caa8f4d7-322e-44f7-ad79-7de767ef1128',
	CreateComments = 'be2deee9-ee12-48b4-a9a5-e369915fc156',
	DeleteComments = '1b1dfcfa-6b96-4a8a-8aca-d76465439ffb',
	DeleteEntries = 'cc51c6b6-be93-4942-a6e4-fdf88f4520b9',
	DesignatedStaff = 'b995a14b-49b4-4f1e-8fac-36a34967ddb0',
	DisableUsers = 'cb46dfbe-5221-4af4-9968-53aec5faa3d4',
	EditAllSongLists = 'b4873d98-b21f-40ee-b1d4-94102ae6e528',
	EditFeaturedLists = 'a639e4a3-86fe-429a-81ea-d0aa05161e40',
	EditProfile = '4f79b01a-7154-4a7f-bc87-a8a9259a9905',
	LockEntries = 'eb02e92e-207f-4330-a763-6bafd2cedde1',
	ManageDatabase = 'd762d720-79ef-4e60-8397-1d638c26d82b',
	EditTags = '2ab6da19-bc5a-4a28-86d4-8ddce399ca0b',
	ManageEntryReports = 'f9eb1d22-9142-4a04-9238-f4ebe5f1fc17',
	ManageEventSeries = 'cf39509b-b9c5-4efc-9b13-2743ffec9aac',
	ManageIPRules = 'f125fe5b-6474-4d52-823f-955c7d19f7c8',
	ManageUserPermissions = 'c0eb147e-10f5-4fea-9b19-b412ef613479',
	ManageTagMappings = 'c93667a9-a270-486d-ab00-db3ff390dd83',
	MergeEntries = 'eb336a5b-8455-4048-bc3a-8003dc522dc5',
	MikuDbImport = '0b879c57-5eba-462a-b842-d9f7dd0befd8',
	MoveToTrash = '99c333a2-ea0a-4a7b-91cb-ceef6f667389',
	ReportUser = '85c730a1-402c-4922-b617-6c6068f5f98e',
	RemoveEditPermission = '6b258b3e-97a1-4cf7-9c4f-80787c2d2266',
	RemoveTagUsages = '135aaf49-08d5-42bb-b8ed-ef1ceb910a69',
	RestoreRevisions = 'e99a1e1c-1742-48c1-877b-17cb2964e8bc',
	UploadMedia = 'be1a2f04-6dc2-4d63-b34e-4499f6389231',
	ViewAuditLog = '8d3d5395-12c9-440a-8120-4911034b9a7e',
	ViewHiddenRatings = '47bcc523-5667-403d-bd20-d2728e1f9c5f',
	ViewHiddenRevisions = 'c3b753d0-7aa8-4c03-8bca-5311fb2bdd2d',
	ManageWebhooks = '838dde1d-51ba-423b-ad8e-c1e2c2024a37',
}

export default class LoginManager {
	public constructor(private readonly values: GlobalValues) {}

	public get isLoggedIn(): boolean {
		return this.values.isLoggedIn;
	}

	public get loggedUserId(): number {
		return this.values.loggedUserId;
	}

	public get loggedUser(): UserWithPermissionsContract | undefined {
		return this.values.loggedUser;
	}

	public get lockdownEnabled(): boolean {
		return !!this.values.lockdownMessage;
	}

	public hasPermission = (token: PermissionToken): boolean => {
		if (token === PermissionToken.Nothing) return true;

		if (!this.loggedUser || !this.loggedUser.active) return false;

		if (token === PermissionToken.ManageDatabase && this.lockdownEnabled)
			return false;

		return this.loggedUser.effectivePermissions.includes(token);
	};

	public get canAccessManageMenu(): boolean {
		return this.hasPermission(PermissionToken.AccessManageMenu);
	}

	public get canBulkDeletePVs(): boolean {
		return this.hasPermission(PermissionToken.BulkDeletePVs);
	}

	public get canCreateComments(): boolean {
		return this.hasPermission(PermissionToken.CreateComments);
	}

	public get canDeleteComments(): boolean {
		return this.hasPermission(PermissionToken.DeleteComments);
	}

	public get canManageDatabase(): boolean {
		return this.hasPermission(PermissionToken.ManageDatabase);
	}

	public get canManageEntryReports(): boolean {
		return this.hasPermission(PermissionToken.ManageEntryReports);
	}

	public get canMikuDbImport(): boolean {
		return this.hasPermission(PermissionToken.MikuDbImport);
	}
}
