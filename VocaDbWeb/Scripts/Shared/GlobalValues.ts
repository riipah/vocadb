import UserWithPermissionsContract from '@DataContracts/User/UserWithPermissionsContract';
import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';

interface MenuPageLink {
	bannerImg: string;
	title: string;
	url: string;
}

// Corresponds to the GlobalValues record class in C#.
export default interface GlobalValues {
	lockdownMessage?: string;
	staticContentHost: string;

	paypalDonateTitle?: string;
	siteName: string;

	bannerUrl?: string;
	blogUrl?: string;
	patreonLink?: string;

	/** URL of the site path, for example "/" */
	baseAddress: string;
	languagePreference: ContentLanguagePreference;
	/** Whether the user is logged in. */
	isLoggedIn: boolean;
	loggedUserId: number;
	loggedUser?: UserWithPermissionsContract;
	culture: string;
	/** UI language code, for example "en" */
	uiCulture: string;

	appLinks: MenuPageLink[];
	bigBanners: MenuPageLink[];
	smallBanners: MenuPageLink[];
	socialLinks: MenuPageLink[];
}
