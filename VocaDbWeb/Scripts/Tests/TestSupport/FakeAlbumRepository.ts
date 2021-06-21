import AlbumRepository from '@Repositories/AlbumRepository';
import HttpClient from '@Shared/HttpClient';

export default class FakeAlbumRepository extends AlbumRepository {
	public deletedId!: number;
	public updatedId!: number;

	public constructor() {
		super(new HttpClient());
	}
}
