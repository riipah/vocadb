﻿using VocaDb.Model.Domain.Albums;
using VocaDb.Model.Domain.Artists;
using VocaDb.Model.Domain.Songs;
using VocaDb.Model.Service.Translations;

namespace VocaDb.Web.Helpers {

	public class EnumTranslations : IEnumTranslations {

		public TranslateableEnum<AlbumReportType> AlbumReportTypeNames => Translate.AlbumReportTypeNames;

		public TranslateableEnum<ArtistReportType> ArtistReportTypeNames => Translate.ArtistReportTypeNames;

		public TranslateableEnum<SongReportType> SongReportTypeNames => Translate.SongReportTypeNames;

	}

}