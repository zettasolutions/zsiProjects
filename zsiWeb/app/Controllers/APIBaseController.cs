using System;
using System.Web;
using System.Web.Mvc;
using zsi.web.Models;
using zsi.Framework.Security.SecurityProvider;
using System.IO.Compression;
using System.Linq;
using System.Configuration;

namespace zsi.web.Controllers
{
    public class APIBaseController : Controller
    {
        #region "Private"
        #endregion

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
            filterContext.RequestContext.HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
            filterContext.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);

            var encodingsAccepted = filterContext.HttpContext.Request.Headers["Accept-Encoding"];
            if (!string.IsNullOrEmpty(encodingsAccepted))
            {

                var RCompression = Boolean.Parse(ConfigurationManager.AppSettings["ResponseCompression"]);
                if (RCompression)
                {
                    System.Data.DataRow[] rows = null;
                    if (SessionHandler.NotIncludeInCompression.Rows.Count > 0) rows = SessionHandler.NotIncludeInCompression.Select(string.Format("actionname='{0}'", ActionName));
                    if (rows == null || rows.Count() == 0)
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
            }
            base.OnActionExecuting(filterContext);
        }
        public ContentResult ToJSON(string sql, bool isProcedure, JsonRowsFormat jsonRowsFormat = JsonRowsFormat.KeyValue)
        {
            using (new impersonate())
            {
                return Content(DataHelper.ToJSON(sql, isProcedure, jsonRowsFormat), "application/json");
            }
        }

       

    }

}