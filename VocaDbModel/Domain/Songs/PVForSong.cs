#nullable disable

using System;
using System.Threading.Tasks;
using VocaDb.Model.DataContracts.PVs;
using VocaDb.Model.Domain.PVs;
using VocaDb.Model.Domain.Security;
using VocaDb.Model.Domain.Users;
using VocaDb.Model.Service.VideoServices;

namespace VocaDb.Model.Domain.Songs
{
	public class PVForSong : PV, IPVWithThumbnail, ISongLink, IEntryWithIntId
	{
		private Song _song;
		private string _thumbUrl;

		public PVForSong()
		{
			ThumbUrl = string.Empty;
		}

		public PVForSong(Song song, PVContract contract)
			: base(contract)
		{
			Song = song;
			Length = contract.Length;
			ThumbUrl = contract.ThumbUrl ?? string.Empty;
			CreatedBy = contract.CreatedBy;
			Disabled = contract.Disabled;
		}

		/// <summary>
		/// ID of the user who added this PV.
		/// Just the primary key for performance purposes.
		/// </summary>
		public virtual int? CreatedBy { get; set; }

		public override bool Disabled { get; set; }

		/// <summary>
		/// Length in seconds.
		/// </summary>
		public virtual int Length { get; set; }

		public virtual Song Song
		{
			get => _song;
			set
			{
				ParamIs.NotNull(() => value);
				_song = value;
			}
		}

		public virtual string ThumbUrl
		{
			get => _thumbUrl;
			set
			{
				ParamIs.NotNull(() => value);
				_thumbUrl = value;
			}
		}

#nullable enable
		public override bool ContentEquals(PVContract? pv)
		{
			return base.ContentEquals(pv) && Disabled == pv.Disabled;
		}
#nullable disable

		public override void CopyMetaFrom(PVContract contract)
		{
			base.CopyMetaFrom(contract);

			Disabled = contract.Disabled;
			ThumbUrl = contract.ThumbUrl;
		}

#nullable enable
		public virtual bool Equals(PVForSong? another)
		{
			if (another == null)
				return false;

			if (ReferenceEquals(this, another))
				return true;

			if (Id == 0)
				return false;

			return Id == another.Id;
		}

		public override bool Equals(object? obj)
		{
			return Equals(obj as PVForSong);
		}

		public override int GetHashCode()
		{
			return base.GetHashCode();
		}
#nullable disable

		public override void OnDelete()
		{
			Song.PVs.Remove(this);
			Song.UpdateNicoId();
			Song.UpdatePVServices();
		}

		/// <summary>
		/// Refresh PV metadata, mainly extended metadata and thumbnail URL, from source.
		/// Title is not refreshed here.
		/// </summary>
		/// <param name="pvParser">PV parser. Cannot be null.</param>
		/// <param name="permissionContext">Permission context. Cannot be null.</param>
		public virtual async Task RefreshMetadata(IPVParser pvParser, IUserPermissionContext permissionContext)
		{
			var result = await pvParser.ParseByUrlAsync(Url, true, permissionContext);
			Author = result.Author;
			ExtendedMetadata = result.ExtendedMetadata;
			ThumbUrl = result.ThumbUrl;
			Length = result.LengthSeconds ?? Length;
		}

#nullable enable
		public override string ToString()
		{
			return $"PV '{PVId}' [{Id}] for {Song}";
		}
#nullable disable
	}
}
