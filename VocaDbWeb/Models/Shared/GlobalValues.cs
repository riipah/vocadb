using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using VocaDb.Model.DataContracts.Users;
using VocaDb.Model.Domain.Globalization;
using VocaDb.Model.Helpers;
using VocaDb.Model.Utils;
using VocaDb.Web.Code;

namespace VocaDb.Web.Models.Shared
{
	public sealed record GlobalValues
	{
		public sealed record MenuPageLink
		{
			public string BannerImg { get; init; }
			public string Title { get; init; }
			public string Url { get; init; }

			public MenuPageLink(MenuPage.Link model)
			{
				BannerImg = model.BannerImg;
				Title = model.Title;
				Url = model.Url;
			}
		}

		public string? LockdownMessage { get; init; }
		public string StaticContentHost { get; init; }

		public string? PaypalDonateTitle { get; init; }
		public string SiteName { get; init; }

		public string? BannerUrl { get; init; }
		public string? BlogUrl { get; init; }
		public string? PatreonLink { get; init; }

		public string? BaseAddress { get; init; }
		[JsonConverter(typeof(StringEnumConverter))]
		public ContentLanguagePreference LanguagePreference { get; init; }
		public bool IsLoggedIn { get; init; }
		public int LoggedUserId { get; init; }
		public SanitizedUserWithPermissionsContract? LoggedUser { get; init; }
		public string Culture { get; init; }
		public string UICulture { get; init; }

		public MenuPageLink[] AppLinks { get; init; }
		public MenuPageLink[] BigBanners { get; init; }
		public MenuPageLink[] SmallBanners { get; init; }
		public MenuPageLink[] SocialLinks { get; init; }

		public GlobalValues(VocaDbPage model)
		{
			LockdownMessage = AppConfig.LockdownMessage;
			StaticContentHost = AppConfig.StaticContentHost;

			PaypalDonateTitle = model.BrandableStrings.Layout.PaypalDonateTitle;
			SiteName = model.BrandableStrings.SiteName;

			BannerUrl = model.Config.SiteSettings.BannerUrl.EmptyToNull();
			BlogUrl = model.Config.SiteSettings.BlogUrl;
			PatreonLink = model.Config.SiteSettings.PatreonLink;

			BaseAddress = model.RootPath;
			LanguagePreference = model.UserContext.LanguagePreference;
			IsLoggedIn = model.UserContext.IsLoggedIn;
			LoggedUserId = model.UserContext.LoggedUserId;
			LoggedUser = model.UserContext.LoggedUser is ServerOnlyUserWithPermissionsContract loggedUser ? new SanitizedUserWithPermissionsContract(loggedUser) : null;
			Culture = model.Culture;
			UICulture = model.UICulture;

			AppLinks = MenuPage.AppLinks.Select(l => new MenuPageLink(l)).ToArray();
			BigBanners = MenuPage.BigBanners.Select(l => new MenuPageLink(l)).ToArray();
			SmallBanners = MenuPage.SmallBanners.Select(l => new MenuPageLink(l)).ToArray();
			SocialLinks = MenuPage.SocialLinks.Select(l => new MenuPageLink(l)).ToArray();
		}
	}
}
