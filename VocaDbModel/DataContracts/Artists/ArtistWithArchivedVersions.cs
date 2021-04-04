#nullable disable

using System.Linq;
using VocaDb.Model.Domain.Artists;
using VocaDb.Model.Domain.Globalization;

namespace VocaDb.Model.DataContracts.Artists
{
	public class ArtistWithArchivedVersionsContract : ArtistContract
	{
#nullable enable
		public ArtistWithArchivedVersionsContract(Artist artist, ContentLanguagePreference languagePreference)
			: base(artist, languagePreference)
		{
			ParamIs.NotNull(() => artist);

			ArchivedVersions = artist.ArchivedVersionsManager.Versions.Select(a => new ArchivedArtistVersionContract(a)).ToArray();
		}
#nullable disable

		public ArchivedArtistVersionContract[] ArchivedVersions { get; init; }
	}
}
