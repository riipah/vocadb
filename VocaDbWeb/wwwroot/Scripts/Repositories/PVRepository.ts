import PVContract from '../DataContracts/PVs/PVContract';
import HttpClient from '../Shared/HttpClient';
import UrlMapper from '../Shared/UrlMapper';

export default class PVRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly urlMapper: UrlMapper,
  ) {}

  public getPVByUrl = (
    pvUrl: string,
    type: string,
    success: (pv: PVContract) => void,
  ): JQueryXHR => {
    var url = this.urlMapper.mapRelative('/api/pvs');
    return $.getJSON(url, { pvUrl: pvUrl, type: type }, success);
  };
}
