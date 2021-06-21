import ContentLanguagePreference from '@Models/Globalization/ContentLanguagePreference';
import NameMatchMode from '@Models/NameMatchMode';
import _ from 'lodash';

export const mergeUrls = (
	base: string | undefined,
	relative: string,
): string => {
	base ??= '/';

	if (base.charAt(base.length - 1) === '/' && relative.charAt(0) === '/')
		return base + relative.substr(1);

	if (base.charAt(base.length - 1) === '/' && relative.charAt(0) !== '/')
		return base + relative;

	if (base.charAt(base.length - 1) !== '/' && relative.charAt(0) === '/')
		return base + relative;

	return base + '/' + relative;
};

export const buildUrl = (...args: string[]): string => {
	return _.reduce(args, (list: string, item: string) => mergeUrls(list, item))!;
};

export const getDate = (date?: Date): string | undefined => {
	return date ? date.toISOString() : undefined;
};

// Common parameters for entry queries (listings).
export interface CommonQueryParams {
	getTotalCount?: boolean;

	// Content language preference
	lang?: ContentLanguagePreference;

	maxResults?: number;

	nameMatchMode?: NameMatchMode;

	start?: number;

	query?: string;
}
