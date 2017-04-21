﻿using System;
using System.Linq;
using VocaDb.Model.Domain.Albums;
using VocaDb.Model.Domain.Globalization;
using VocaDb.Model.Domain.ReleaseEvents;
using VocaDb.Model.Service.Helpers;
using VocaDb.Model.Service.Search;

namespace VocaDb.Model.Service.QueryableExtenders {

	public static class ReleaseEventQueryableExtender {

		public static IQueryable<ReleaseEvent> WhereHasName(this IQueryable<ReleaseEvent> query, SearchTextQuery textQuery) {

			if (textQuery.IsEmpty)
				return query;

			switch (textQuery.MatchMode) {
				case NameMatchMode.Exact:
					return query.Where(t => t.Name == textQuery.Query);
				case NameMatchMode.StartsWith:
					return query.Where(t => t.Name.StartsWith(textQuery.Query));
				case NameMatchMode.Words:
					return textQuery.Words
						.Take(FindHelpers.MaxSearchWords)
						.Aggregate(query, (q, word) => q.Where(list => list.Name.Contains(word)));
				default:
					return query.Where(t => t.Name.Contains(textQuery.Query));
			}

		}

		public static IOrderedQueryable<ReleaseEvent> OrderByDate(this IQueryable<ReleaseEvent> query, SortDirection? direction) {
			return query.OrderBy(e => e.Date.DateTime, direction ?? SortDirection.Descending);
		}

		/// <summary>
		/// Sort query.
		/// </summary>
		/// <param name="query">Query. Cannot be null.</param>
		/// <param name="sortRule">Sort rule.</param>
		/// <param name="direction">Sort direction. If null, default direction is used.</param>
		/// <returns>Sorted query. Cannot be null.</returns>
		public static IQueryable<ReleaseEvent> OrderBy(this IQueryable<ReleaseEvent> query, EventSortRule sortRule, ContentLanguagePreference languagePreference, SortDirection? direction) {

			switch (sortRule) {
				case EventSortRule.Date:
					return query.OrderByDate(direction);
				case EventSortRule.Name:
					return query.OrderBy(r => r.Name);
				/*case EventSortRule.SeriesName:
					return query
						.OrderBy(r => r.Series.Name)
						.ThenBy(r => r.SeriesNumber);*/ // FIXME: add this
			}

			return query;

		}

		public static IQueryable<ReleaseEvent> WhereDateIsBetween(this IQueryable<ReleaseEvent> query, DateTime? begin, DateTime? end) {
			
			if (begin.HasValue && end.HasValue)
				return query.Where(e => e.Date.DateTime != null && e.Date.DateTime >= begin && e.Date.DateTime < end);

			if (begin.HasValue)
				return query.Where(e => e.Date.DateTime != null && e.Date.DateTime >= begin);

			if (end.HasValue)
				return query.Where(e => e.Date.DateTime != null && e.Date.DateTime < end);

			return query;

		}

		public static IQueryable<ReleaseEvent> WhereHasSeries(this IQueryable<ReleaseEvent> query, int seriesId) {
			
			if (seriesId == 0)
				return query;

			return query.Where(e => e.Series.Id == seriesId);

		} 

	}

	public enum EventSortRule {
		
		None,

		Name,

		Date,

		SeriesName

	}

}
