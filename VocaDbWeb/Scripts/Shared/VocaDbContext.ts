import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export default class VocaDbContext {
	/** URL of the site path, for example "/" */
	public baseAddress = '';

	/** Whether the user is logged in. */
	public isLoggedIn = false;

	public loggedUserId = 0;

	public languagePreference = ContentLanguagePreference.Default;

	public culture = '';

	/** UI language code, for example "en" */
	public uiCulture = '';
}
