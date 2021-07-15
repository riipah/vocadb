#nullable disable

using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.Caching;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using NHibernate;
using VocaDb.Model.DataContracts.Songs;
using VocaDb.Model.Domain;
using VocaDb.Model.Domain.PVs;
using VocaDb.Model.Domain.Security;
using VocaDb.Model.Domain.Web;
using VocaDb.Model.Service;
using VocaDb.Model.Service.Helpers;
using VocaDb.Model.Service.Security;
using VocaDb.Web.Code;
using VocaDb.Web.Code.Security;
using VocaDb.Web.Helpers;
using VocaDb.Web.Models.Admin;

namespace VocaDb.Web.Controllers
{
	public class AdminController : ControllerBase
	{
		private readonly IPRuleManager _ipRuleManager;
		private readonly ISessionFactory _sessionFactory;
		private AdminService Service { get; set; }
		private readonly OtherService _otherService;

		public AdminController(AdminService service, OtherService otherService,
			IPRuleManager ipRuleManager, ISessionFactory sessionFactory)
		{
			Service = service;
			_otherService = otherService;
			_ipRuleManager = ipRuleManager;
			_sessionFactory = sessionFactory;
		}

		[Authorize]
		public ActionResult ActiveEdits()
		{
			PermissionContext.VerifyPermission(PermissionToken.Admin);

			var items = Service.GetActiveEditors().Select(t => Tuple.Create(t.Item1, t.Item2, t.Item3)).ToArray();
			return View(items);
		}

		[Authorize]
		public ActionResult AuditLogEntries(ViewAuditLogModel model, int start = 0)
		{
			PermissionContext.VerifyPermission(PermissionToken.ViewAuditLog);

			var excludeUsers = (!string.IsNullOrEmpty(model.ExcludeUsers)
				? model.ExcludeUsers.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(u => u.Trim()).ToArray()
				: new string[0]);

			var cutoffDays = (string.IsNullOrEmpty(model.UserName) ? 365 : 0);

			var entries = Service.GetAuditLog(model.Filter, start, 200, cutoffDays, model.UserName, excludeUsers, model.OnlyNewUsers, model.GroupId);

			return PartialView(entries);
		}

		[Authorize]
		public async Task<ActionResult> CheckSFS(string ip)
		{
			PermissionContext.VerifyPermission(PermissionToken.ManageUserPermissions);

			var result = await new StopForumSpamClient().CallApiAsync(ip);

			if (result == null)
				return new EmptyResult();

			return PartialView("Partials/_SFSCheckResponse", result);
		}

		[Authorize]
		public ActionResult ClearCaches()
		{
			PermissionContext.VerifyPermission(PermissionToken.Admin);

			var cache = MemoryCache.Default;

			foreach (var item in cache)
			{
				cache.Remove(item.Key);
			}

			return RedirectToAction("Index");
		}

		public ActionResult CleanupOldLogEntries()
		{
			var count = Service.CleanupOldLogEntries();

			TempData.SetStatusMessage("Cleanup complete - " + count + " entries removed.");

			return RedirectToAction("Index");
		}

		public ActionResult CreateMissingThumbs()
		{
			Service.CreateMissingThumbs();

			TempData.SetStatusMessage("Operation completed");

			return RedirectToAction("Index");
		}

		public ActionResult CreateXmlDump()
		{
			Service.CreateXmlDump();

			TempData.SetStatusMessage("Dump created");

			return RedirectToAction("Index");
		}

		[Authorize]
		public ActionResult DeleteEntryReport(int id)
		{
			PermissionContext.VerifyPermission(PermissionToken.ManageEntryReports);

			Service.DeleteEntryReports(new[] { id });
			TempData.SetStatusMessage("Reports deleted");

			return RedirectToAction("ViewEntryReports", new { status = ReportStatus.Closed });
		}

		[Authorize]
		public ActionResult DeletePVsByAuthor(string author)
		{
			var count = Service.DeletePVsByAuthor(author, PVService.Youtube);

			TempData.SetSuccessMessage($"Deleted {count} PVs by '{author}'.");

			return View("PVsByAuthor", new PVsByAuthor(author ?? string.Empty, new PVForSongContract[] { }));
		}

		public ActionResult GeneratePictureThumbs()
		{
			var count = Service.GeneratePictureThumbs();

			TempData.SetStatusMessage(count + " picture thumbnails recreated.");

			return RedirectToAction("Index");
		}

		[Authorize]
		public ActionResult ManageIPRules()
		{
			PermissionContext.VerifyPermission(PermissionToken.ManageIPRules);

			var rules = _otherService.GetIPRules();
			return View(rules);
		}

		[Authorize]
		[HttpPost]
		public ActionResult ManageIPRules([ModelBinder(BinderType = typeof(JsonModelBinder))] IPRule[] rules)
		{
			PermissionContext.VerifyPermission(PermissionToken.ManageIPRules);

			Service.UpdateIPRules(rules);
			_ipRuleManager.Reset(rules.Select(i => i.Address));

			TempData.SetSuccessMessage("IP rules updated.");

			return View(rules);
		}

		[Authorize]
		public ActionResult ManageEntryTagMappings() => View();

		[Authorize]
		public ActionResult ManageTagMappings() => View();

		public ActionResult PVAuthorNames(string term)
		{
			var authors = Service.FindPVAuthorNames(term);

			return Json(authors);
		}

		[Authorize]
		public ActionResult PVsByAuthor(string author, int maxResults = 50)
		{
			var songs = Service.GetSongPVsByAuthor(author ?? string.Empty, maxResults);

			var model = new PVsByAuthor(author ?? string.Empty, songs);

			return View(model);
		}

		public ActionResult RefreshDbCache()
		{
			DatabaseHelper.ClearSecondLevelCache(_sessionFactory);

			return RedirectToAction("Index");
		}

		public ActionResult UpdateAdditionalNames()
		{
			Service.UpdateAdditionalNames();
			TempData.SetStatusMessage("Updated additional names strings");
			return RedirectToAction("Index");
		}

		public ActionResult UpdateAlbumRatingTotals()
		{
			Service.UpdateAlbumRatingTotals();
			TempData.SetStatusMessage("Updated album rating totals");
			return RedirectToAction("Index");
		}

		public ActionResult UpdateArtistStrings()
		{
			Service.UpdateArtistStrings();

			return RedirectToAction("Index");
		}

		public ActionResult UpdateLinkCategories()
		{
			Service.UpdateWebLinkCategories();
			TempData.SetStatusMessage("Updated link categories");

			return RedirectToAction("Index");
		}

		public ActionResult UpdateNicoIds()
		{
			Service.UpdateNicoIds();

			return RedirectToAction("Index");
		}

		public ActionResult UpdateNormalizedEmailAddresses()
		{
			Service.UpdateNormalizedEmailAddresses();

			return RedirectToAction("Index");
		}

		public ActionResult UpdatePVIcons()
		{
			Service.UpdatePVIcons();

			return RedirectToAction("Index");
		}

		public ActionResult UpdateSongFavoritedTimes()
		{
			Service.UpdateSongFavoritedTimes();
			TempData.SetStatusMessage("Updated favorited song counts");
			return RedirectToAction("Index");
		}

		[Authorize]
		public ActionResult UpdateTagVoteCounts()
		{
			var count = Service.UpdateTagVoteCounts();
			TempData.SetStatusMessage($"Updated tag vote counts, {count} corrections made");
			return RedirectToAction("Index");
		}

		[Authorize]
		public ActionResult DeployWebsite()
		{
			PermissionContext.VerifyPermission(PermissionToken.Admin);

			var deployFile = Path.Combine(HttpContext.RequestServices.GetRequiredService<IHttpContext>().ServerPathMapper.MapPath("~"), "..", "..", "..", "deploy.cmd");

			Process.Start(deployFile, "doNotPause");

			return RedirectToAction("Index");
		}

		[Authorize]
		public ActionResult ViewAuditLog(ViewAuditLogModel model)
		{
			PermissionContext.VerifyPermission(PermissionToken.ViewAuditLog);

			return View(model ?? new ViewAuditLogModel());
		}

		[Authorize]
		public ActionResult ViewEntryReports(ReportStatus status = ReportStatus.Open)
		{
			ViewBag.ReportStatus = status;
			PermissionContext.VerifyPermission(PermissionToken.ManageEntryReports);

			var reports = Service.GetEntryReports(status);

			return View(reports);
		}

		[Authorize]
		public ActionResult ViewSysLog()
		{
			PermissionContext.VerifyPermission(PermissionToken.ViewAuditLog);

			var logContents = new LogFileReader().GetLatestLogFileContents();

			return Content(logContents, "text/plain");

			//return View(new ViewSysLog(logContents));
		}

		[Authorize]
		public IActionResult ManageWebhooks()
		{
			PermissionContext.VerifyPermission(PermissionToken.ManageWebhooks);

			return View();
		}
	}
}
