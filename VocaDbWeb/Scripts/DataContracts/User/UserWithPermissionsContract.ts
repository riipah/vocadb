// Corresponds to the SanitizedUserWithPermissionsContract record class in C#.
export default interface UserWithPermissionsContract {
	id: number;
	name: string;
	active: boolean;
	effectivePermissions: string[];
	unreadMessagesCount: number;
}
