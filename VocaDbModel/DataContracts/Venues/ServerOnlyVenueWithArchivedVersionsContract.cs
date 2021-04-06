#nullable disable

using System.Linq;
using System.Runtime.Serialization;
using VocaDb.Model.Domain.Globalization;
using VocaDb.Model.Domain.Venues;

namespace VocaDb.Model.DataContracts.Venues
{
	public class ServerOnlyVenueWithArchivedVersionsContract : VenueContract
	{
		public ServerOnlyArchivedVenueVersionContract[] ArchivedVersions { get; init; }

		public ServerOnlyVenueWithArchivedVersionsContract(Venue venue, ContentLanguagePreference languagePreference) : base(venue, languagePreference)
		{
			ArchivedVersions = venue.ArchivedVersionsManager.Versions.Select(a => new ServerOnlyArchivedVenueVersionContract(a)).ToArray();
		}
	}
}
