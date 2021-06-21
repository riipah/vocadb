import { buildUrl, mergeUrls } from '@Repositories/BaseRepository';

import functions from './GlobalFunctions';

export default class UrlMapper {
	public static buildUrl = (...args: string[]): string => buildUrl(...args);

	public static mergeUrls = (base: string, relative: string): string =>
		mergeUrls(base, relative);

	public constructor(public baseUrl: string) {}

	public mapRelative(relative: string): string {
		return functions.mergeUrls(this.baseUrl, relative);
	}
}
