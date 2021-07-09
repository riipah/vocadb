#nullable disable

using System.Linq;
using VocaDb.Model.Domain.Albums;
using VocaDb.Model.Domain.Globalization;
using VocaDb.Model.Service.Helpers;

namespace VocaDb.Model.Service.Search.AlbumSearch
{
	public class AlbumSearchSort
	{
		private static IQueryable<Album> AddReleaseRestriction(IQueryable<Album> criteria)
		{
			return criteria.Where(a => a.OriginalRelease.ReleaseDate.Year != null);
		}

		public static IQueryable<Album> AddOrder(IQueryable<Album> criteria, AlbumSortRule sortRule, ContentLanguagePreference languagePreference) => sortRule switch
		{
			AlbumSortRule.Name => FindHelpers.AddNameOrder(criteria, languagePreference),
			AlbumSortRule.ReleaseDate => AddReleaseRestriction(criteria).OrderByDescending(a => a.OriginalRelease.ReleaseDate.Year).ThenByDescending(a => a.OriginalRelease.ReleaseDate.Month).ThenByDescending(a => a.OriginalRelease.ReleaseDate.Day),
			AlbumSortRule.AdditionDate => criteria.OrderByDescending(a => a.CreateDate),
			AlbumSortRule.RatingAverage => criteria.OrderByDescending(a => a.RatingAverageInt).ThenByDescending(a => a.RatingCount),
			AlbumSortRule.NameThenReleaseDate => FindHelpers.AddNameOrder(criteria, languagePreference).ThenBy(a => a.OriginalRelease.ReleaseDate.Year).ThenBy(a => a.OriginalRelease.ReleaseDate.Month).ThenBy(a => a.OriginalRelease.ReleaseDate.Day),
			_ => criteria,
		};
	}
}
