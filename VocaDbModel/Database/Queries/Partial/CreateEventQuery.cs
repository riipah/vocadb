﻿using VocaDb.Model.Database.Repositories;
using VocaDb.Model.DataContracts.ReleaseEvents;
using VocaDb.Model.Domain;
using VocaDb.Model.Domain.Activityfeed;
using VocaDb.Model.Domain.Albums;
using VocaDb.Model.Domain.ReleaseEvents;
using VocaDb.Model.Domain.Security;
using VocaDb.Model.Domain.Users;
using VocaDb.Model.Helpers;
using VocaDb.Model.Service.Search;

namespace VocaDb.Model.Database.Queries.Partial {

	public class CreateEventQuery {

		/// <summary>
		/// Returns a release event if it can be uniquely identified (by either name or ID).
		/// Otherwise attempts to create a new event based on given name.
		/// Makes an intelligent guess to create either standalone event or series event.
		/// This also makes sure no event with a duplicate name is created.
		/// </summary>
		/// <param name="ctx">Database context.</param>
		/// <param name="userContext">User context.</param>
		/// <param name="contract">Release event data.</param>
		/// <param name="forEntry">Which entry the release event will be created for. Optional, can be null.</param>
		/// <returns>The release event. Can be null if no name or ID is specified. Returned event can be either a new event or existing event.</returns>
		public ReleaseEvent FindOrCreate(IDatabaseContext ctx, IUserPermissionContext userContext, IReleaseEvent contract, IEntryBase forEntry) {

			if (contract == null || (contract.Id == 0 && string.IsNullOrWhiteSpace(contract.Name)))
				return null;

			var existing = ctx.NullSafeLoad<ReleaseEvent>(contract);

			if (existing != null)
				return existing;

			var searchResult = new ReleaseEventSearch(ctx).Find(contract.Name, userContext.LanguagePreference);

			if (searchResult.IsKnownEvent)
				return ctx.Load<ReleaseEvent>(searchResult.EventId);

			var series = ctx.NullSafeLoad<ReleaseEventSeries>(searchResult.Series);

			ReleaseEvent newEvent;

			if (series == null) {
				newEvent = new ReleaseEvent(string.Empty, null, searchResult.EventName.EmptyToNull() ?? contract.Name);
			} else {
				newEvent = new ReleaseEvent(string.Empty, null, series, searchResult.SeriesNumber, searchResult.SeriesSuffix, null, false);
			}

			ctx.Save(newEvent);

			var eventDiff = new ReleaseEventDiff(ReleaseEventEditableFields.Name);
			eventDiff.Name.Set();

			var archivedVersion = ArchivedReleaseEventVersion.Create(newEvent, eventDiff, ctx.OfType<User>().CreateAgentLoginData(userContext), EntryEditEvent.Created, "Created for " + forEntry);
			ctx.Save(archivedVersion);

			return newEvent;

		}

	}

}
