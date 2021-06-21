import { injectable } from 'inversify';
import 'reflect-metadata';

import vdb from './VdbStatic';
import VocaDbContext from './VocaDbContext';

@injectable()
export default class VocaDbContextAccessor {
	public get vocaDbContext(): VocaDbContext {
		return vdb.values;
	}
}
