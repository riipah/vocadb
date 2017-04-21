﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using VocaDb.Model;
using VocaDb.Model.DataContracts;
using VocaDb.Model.DataContracts.ReleaseEvents;
using VocaDb.Model.Domain;
using VocaDb.Model.Domain.ReleaseEvents;
using VocaDb.Model.Domain.Security;
using VocaDb.Web.Code;

namespace VocaDb.Web.Models.Event {

	[PropertyModelBinder]
	public class SeriesEdit {

		public SeriesEdit() { 

		}

		public SeriesEdit(ReleaseEventSeriesForEditContract contract, IUserPermissionContext userContext) {

			ParamIs.NotNull(() => contract);

			Category = contract.Category;
			Contract = contract;
			Description = contract.Description;
			Id = contract.Id;
			Name = contract.Name;
			Status = contract.Status;
			WebLinks = contract.WebLinks;

			AllowedEntryStatuses = EntryPermissionManager.AllowedEntryStatuses(userContext).ToArray();

		}

		public EntryStatus[] AllowedEntryStatuses { get; set; }

		public EventCategory Category { get; set; }

		public ReleaseEventSeriesForEditContract Contract { get; set; }

		public string Description { get; set; }

		public int Id { get; set; }

		[Required]
		public string Name { get; set; }

		[FromJson]
		public LocalizedStringWithIdContract[] Names { get; set; }

		public EntryStatus Status { get; set; }

		[FromJson]
		public WebLinkContract[] WebLinks { get; set; }

		public ReleaseEventSeriesForEditContract ToContract() {

			return new ReleaseEventSeriesForEditContract { 
				Category = Category,
				Description = this.Description ?? string.Empty, 
				Id = this.Id,
				Name = this.Name,
				Names = this.Names.ToArray(),
				Status = Status,
				WebLinks = this.WebLinks
			};

		}

	}
}