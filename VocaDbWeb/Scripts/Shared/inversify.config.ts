import AdminRepository from '@Repositories/AdminRepository';
import AlbumRepository from '@Repositories/AlbumRepository';
import ArtistRepository from '@Repositories/ArtistRepository';
import DiscussionRepository from '@Repositories/DiscussionRepository';
import EntryReportRepository from '@Repositories/EntryReportRepository';
import EntryRepository from '@Repositories/EntryRepository';
import PVRepository from '@Repositories/PVRepository';
import ReleaseEventRepository from '@Repositories/ReleaseEventRepository';
import ResourceRepository from '@Repositories/ResourceRepository';
import SongListRepository from '@Repositories/SongListRepository';
import SongRepository from '@Repositories/SongRepository';
import TagRepository from '@Repositories/TagRepository';
import UserRepository from '@Repositories/UserRepository';
import VenueRepository from '@Repositories/VenueRepository';
import { Container } from 'inversify';

import HttpClient from './HttpClient';
import UrlMapperFactory from './UrlMapperFactory';
import VocaDbContext from './VocaDbContext';
import VocaDbContextAccessor from './VocaDbContextAccessor';

const container = new Container();

container.bind(VocaDbContextAccessor).toSelf().inSingletonScope();
container
	.bind(VocaDbContext)
	.toDynamicValue(
		(context) => context.container.get(VocaDbContextAccessor).vocaDbContext,
	)
	.inSingletonScope();
container.bind(HttpClient).toSelf().inSingletonScope();
container.bind(UrlMapperFactory).toSelf().inSingletonScope();

container.bind(AdminRepository).toSelf().inSingletonScope();
container.bind(AlbumRepository).toSelf().inSingletonScope();
container.bind(ArtistRepository).toSelf().inSingletonScope();
container.bind(DiscussionRepository).toSelf().inSingletonScope();
container.bind(EntryReportRepository).toSelf().inSingletonScope();
container.bind(EntryRepository).toSelf().inSingletonScope();
container.bind(PVRepository).toSelf().inSingletonScope();
container.bind(ReleaseEventRepository).toSelf().inSingletonScope();
container.bind(ResourceRepository).toSelf().inSingletonScope();
container.bind(SongListRepository).toSelf().inSingletonScope();
container.bind(SongRepository).toSelf().inSingletonScope();
container.bind(TagRepository).toSelf().inSingletonScope();
container.bind(UserRepository).toSelf().inSingletonScope();
container.bind(VenueRepository).toSelf().inSingletonScope();

export { container };
