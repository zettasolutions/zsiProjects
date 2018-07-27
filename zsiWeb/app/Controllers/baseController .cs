using System;
using System.Web;
using System.Web.Mvc;
using zsi.web.Models;
using zsi.Framework.Security.SecurityProvider;
using System.IO.Compression;
using System.Linq;

namespace zsi.web.Controllers
{
    public class BaseController : Controller
    {
     

        public user CurrentUser { get { return SessionHandler.CurrentUser; } }
        public appProfile AppConfig { get { return SessionHandler.AppConfig; } }

        public IBasicFormAuth _FormAuth;
        public IBasicFormAuth FormAuth
        {
            get
            {
                if (_FormAuth == null)
                {
                    _FormAuth = new BasicFormAuth();
                }
                return _FormAuth;
            }
            set
            {
                _FormAuth = (BasicFormAuth)value;
            }
        }

        public ActionResult ShowNotAllowedPage()
        {
            return PartialView("~/Views/Shared/_NotAllowed.cshtml");
        }
        public bool isAuthorizedUser()
        {
            bool f = false;
            string sn = "zsi_login";
            if (Session[sn] == null) return f;
            if (Session[sn].ToString() != "Y") return f;
            return true;
        }

        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonNetResult(data, contentType, contentEncoding, JsonRequestBehavior.AllowGet);
        }
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (Session["zsi_login"] == null) Session["zsi_login"] = "N";
            string ControllerName = filterContext.Controller.GetType().Name.ToLower().Replace("controller", "");
            string ActionName = filterContext.ActionDescriptor.ActionName.ToLower();
            filterContext.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);

            var encodingsAccepted = filterContext.HttpContext.Request.Headers["Accept-Encoding"];
            if (!string.IsNullOrEmpty(encodingsAccepted))
            {
                string[] notIncludedInCompression = { "generateexcelfile", "generatehtmltoexcel", "loadfile" };
                if (!notIncludedInCompression.Contains(ActionName.ToLower()))
                {
                    encodingsAccepted = encodingsAccepted.ToLowerInvariant();
                    var response = filterContext.HttpContext.Response;
                    if (encodingsAccepted.Contains("deflate"))
                    {
                        response.AppendHeader("Content-encoding", "deflate");
                        response.Filter = new DeflateStream(response.Filter, CompressionMode.Compress);
                    }
                    else if (encodingsAccepted.Contains("gzip"))
                    {
                        response.AppendHeader("Content-encoding", "gzip");
                        response.Filter = new GZipStream(response.Filter, CompressionMode.Compress);
                    }
                }
            }
            base.OnActionExecuting(filterContext);
        }
        private void CheckActionLogOn(ActionExecutingContext filterContext, string CurrentActionName, string[] ExceptionedActions)
        {

            if (!Array.Exists(ExceptionedActions, e => e.Equals(CurrentActionName)))
            {

                /*if (CurrentUser.UserId == 0)
                {
                    FormAuth.AbandonUserSession();
                    filterContext.Result = new RedirectResult("/");
                }*/
            }

        }
        public ContentResult ToJSON(string sql, bool isProcedure)
        {

            return Content(DataHelper.ToJSON(sql, isProcedure), "application/json");
        }

        private string replaceIncludedScripts(string content) {
            return content
                    .Replace("src=\"/", "src=\"" + Url.Content("~/"))
                    .Replace("src='/", "src='" + Url.Content("~/"))
                    .Replace("href=\"/", "href=\"" + Url.Content("~/"))
                    .Replace("href='/", "href='" + Url.Content("~/"))
            ;
        }

        private string GetScriptLinkCurrentVersion(string name)
        {
            javascript _d = new dcJavaScript().GetInfo(name);
            string result = "";
            if (_d.js_id != null) result = string.Format("<script src='{0}javascript/name/{1}?rev={2}'></script>", Url.Content("~/"), name, _d.rev_no);
            return result;
        }

        public void setPageLinks(string pageName,string isPublic="N")
        {
            string defaultPage = "_layout";
            dcPageData dc;
            PageData d;

            dc = new dcPageData();
            d = dc.GetData(pageName,this.CurrentUser.userId, isPublic);
            ViewBag.role = (d.role != null ? d.role :"");
            ViewBag.GetScriptLinkCurrentVersion = new Func<string, string>(GetScriptLinkCurrentVersion);

            if (d.page_id != 0)
                {
                    ViewBag.masterPage = d.master_page_name;
                    ViewBag.pageName = pageName;
                    ViewBag.pageTitle = d.page_title;
                    ViewBag.template = replaceIncludedScripts(d.pt_content);
                    ViewBag.layoutPage = string.Format("~/Views/Shared/{0}.cshtml", (isPublic =="Y" ? "_Public" : (d.master_page_name == null ? defaultPage : d.master_page_name)));

                    if (d.page_js_rev_no != 0)
                        ViewBag.pageJSLink = string.Format("<script src='{0}javascript/name/{1}?rev={2}'></script>", Url.Content("~/"), pageName, d.page_js_rev_no);
                }
                else
                {
                    ViewBag.masterPage = defaultPage;
                    ViewBag.template = "<div class='pageNotFound'>Page Not Found.</div>";
                    ViewBag.layoutPage = string.Format("~/Views/Shared/{0}.cshtml", (isPublic == "Y" ? "_Public" : defaultPage) );

                }
            
        }

        public void setRequestedURL()
        {
            Session["requestedURL"] = Request.Url.AbsoluteUri;
        }

        public string gePriorityURL(string currentPage)
        {

            var _sName = "requestedURL";
            string _url = currentPage;

            if (Session["isAuthenticated"] == null) Session["isAuthenticated"] = "N";
            if (Session["isAuthenticated"].ToString() == "Y"  &&  Session[_sName] != null )
            {
                _url = Session[_sName].ToString();
                Session[_sName] = null;
            }
            return _url;
        }

    }

}