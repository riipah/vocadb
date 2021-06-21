import { injectable } from 'inversify';
import 'reflect-metadata';

import UrlMapper from './UrlMapper';

@injectable()
export default class UrlMapperFactory {
	public createUrlMapper = (baseUrl: string): UrlMapper =>
		new UrlMapper(baseUrl);
}
