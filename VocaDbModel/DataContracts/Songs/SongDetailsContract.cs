﻿using System;
using System.Linq;
using System.Runtime.Serialization;
using VocaDb.Model.DataContracts.Albums;
using VocaDb.Model.DataContracts.Artists;
using VocaDb.Model.DataContracts.PVs;
using VocaDb.Model.DataContracts.ReleaseEvents;
using VocaDb.Model.DataContracts.Tags;
using VocaDb.Model.Domain.Globalization;
using VocaDb.Model.Domain.Images;
using VocaDb.Model.Domain.Security;
using VocaDb.Model.Domain.Songs;
using VocaDb.Model.Utils.Config;

namespace VocaDb.Model.DataContracts.Songs {

	[DataContract(Namespace = Schemas.VocaDb)]
	public class SongDetailsContract {

		public SongDetailsContract() {}

		public SongDetailsContract(Song song, ContentLanguagePreference languagePreference,
			SongListBaseContract[] pools, ISpecialTags specialTags, IUserPermissionContext userContext, IEntryThumbPersister thumbPersister) {

			Song = new SongContract(song, languagePreference);

			AdditionalNames = song.Names.GetAdditionalNamesStringForLanguage(languagePreference);
			Albums = song.OnAlbums.OrderBy(a => a.OriginalReleaseDate.SortableDateTime).Select(a => new AlbumContract(a, languagePreference)).ToArray();
			AlternateVersions = song.AlternateVersions.Select(s => new SongContract(s, languagePreference, getThumbUrl: false)).OrderBy(s => s.PublishDate).ToArray();
			Artists = song.Artists.Select(a => new ArtistForSongContract(a, languagePreference)).OrderBy(a => a.Name).ToArray();
			ArtistString = song.ArtistString[languagePreference];
			CanEditPersonalDescription = EntryPermissionManager.CanEditPersonalDescription(userContext, song);
			CanRemoveTagUsages = EntryPermissionManager.CanRemoveTagUsages(userContext, song);
			CreateDate = song.CreateDate;
			Deleted = song.Deleted;
			LikeCount = song.UserFavorites.Count(f => f.Rating == SongVoteRating.Like);
			LyricsFromParents = song.GetLyricsFromParents(specialTags).Select(l => new LyricsForSongContract(l, false)).ToArray();
			Notes = song.Notes;
			OriginalVersion = (song.OriginalVersion != null && !song.OriginalVersion.Deleted ? 
				new SongForApiContract(song.OriginalVersion, null, languagePreference, SongOptionalFields.AdditionalNames | SongOptionalFields.ThumbUrl) : null);

			PVs = song.PVs.Select(p => new PVContract(p)).ToArray();
			ReleaseEvent = song.ReleaseEvent != null && !song.ReleaseEvent.Deleted ? new ReleaseEventForApiContract(song.ReleaseEvent, languagePreference, ReleaseEventOptionalFields.None, thumbPersister, true) : null;
			PersonalDescriptionText = song.PersonalDescriptionText;
			var author = song.PersonalDescriptionAuthor;
			PersonalDescriptionAuthor = author != null ? new ArtistForApiContract(author, languagePreference, thumbPersister, true, ArtistOptionalFields.MainPicture) : null;
			Tags = song.Tags.ActiveUsages.Select(u => new TagUsageForApiContract(u, languagePreference)).OrderByDescending(t => t.Count).ToArray();
			TranslatedName = new TranslatedStringContract(song.TranslatedName);
			WebLinks = song.WebLinks.Select(w => new WebLinkContract(w)).OrderBy(w => w.DescriptionOrUrl).ToArray();

			Pools = pools;

		}

		/// <summary>
		/// Album id of the album being browsed.
		/// Null if none.
		/// </summary>
		public AlbumContract Album { get; set; }

		[DataMember]
		public AlbumContract[] Albums { get; set; }

		[DataMember]
		public SongInAlbumContract AlbumSong { get; set; }

		[DataMember]
		public SongContract[] AlternateVersions { get; set; }

		[DataMember]
		public string AdditionalNames { get; set; }

		[DataMember]
		public ArtistForSongContract[] Artists { get; set; }

		[DataMember]
		public string ArtistString { get; set; }

		public bool CanEditPersonalDescription { get; set; }

		public bool CanRemoveTagUsages { get; set; }

		[DataMember]
		public int CommentCount { get; set; }

		[DataMember]
		public DateTime CreateDate { get; set; }

		[DataMember]
		public bool Deleted { get; set; }

		[DataMember]
		public int Hits { get; set; }

		[DataMember]
		public CommentForApiContract[] LatestComments { get; set; }

		[DataMember]
		public int LikeCount { get; set; }

		[DataMember]
		public int ListCount { get; set; }

		[DataMember]
		public LyricsForSongContract[] LyricsFromParents { get; set; }

		[DataMember]
		public SongContract MergedTo { get; set; }

		/// <summary>
		/// Next song on the album being browsed (identified by AlbumId).
		/// Can be null.
		/// </summary>
		[DataMember]
		public SongInAlbumContract NextSong { get; set; }

		[DataMember]
		public EnglishTranslatedString Notes { get; set; }

		[DataMember]
		public SongForApiContract OriginalVersion { get; set; }

		[DataMember]
		public string PersonalDescriptionText { get; set; }

		[DataMember]
		public ArtistForApiContract PersonalDescriptionAuthor { get; set; }

		[DataMember]
		public SongListBaseContract[] Pools { get; set; }

		public LyricsForSongContract PreferredLyrics { get; set; }

		/// <summary>
		/// Previous song on the album being browsed (identified by AlbumId).
		/// Can be null.
		/// </summary>
		[DataMember]
		public SongInAlbumContract PreviousSong { get; set; }

		[DataMember(Name = "pvs")]
		public PVContract[] PVs { get; set; }

		[DataMember]
		public ReleaseEventForApiContract ReleaseEvent { get; set; }

		[DataMember]
		public SongContract Song { get; set; }

		[DataMember]
		public SongForApiContract[] Suggestions { get; set; }

		[DataMember]
		public TagUsageForApiContract[] Tags { get; set; }

		[DataMember]
		public TranslatedStringContract TranslatedName { get; set; }

		[DataMember]
		public SongVoteRating UserRating { get; set; }

		[DataMember]
		public WebLinkContract[] WebLinks { get; set; }

	}

}
