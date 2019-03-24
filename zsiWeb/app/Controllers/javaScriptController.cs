using System.Collections.Generic;
using System.Web.Mvc;
using zsi.web.Models;
using zsi.DataAccess;
using zsi.DataAccess.Provider.SQLServer;
using zsi.Framework.Common;
using Microsoft.Ajax.Utilities;

namespace zsi.web.Controllers
{
    public class JavaScriptController : BaseController
    {

        public ActionResult Index()
        {
            if ( this.isAuthorizedUser() )
            {
                setPageLinks("admin");
                return View();
            }
            else
            {
                setRequestedURL();
                return Redirect(Url.Content("~/"));
            }
        }

        public ActionResult source(string pageName)
        {
            if (CurrentUser.userName == null)
                return Redirect(Url.Content("~/"));
            else
            {
                if ( ! this.isAuthorizedUser())
                    return this.ShowNotAllowedPage();
                else
                {
                    javascript_v d = new dcJavaScript().GetInfo(pageName);
                    ViewBag.jsId = d.js_id;
                    ViewBag.pageId = d.page_id;
                    ViewBag.pageTitle = d.page_title;
                    ViewBag.jsContent = d.js_content;
                    return View();
                }
                
            }
        }

        public ActionResult name(string pageName)
        {
            var js = new dcJavaScript().GetInfo(pageName);
            if (CurrentUser.userName == null && js.is_public=="N")
                return Redirect(Url.Content("~/"));
            else
            {
                var r = js.js_content;
                var _isDev = Session["zsi_login"].ToString() == "Y" ? true : false;
                if ( !_isDev)
                    r = JsMinify(r);
                else if ( !_isDev && (this.AppConfig.is_source_minified == "Y" || js.is_public == "Y"))
                        r = JsMinify(r);
                return Content(r, "application/javascript");
            }
        }


        private string JsMinify(string content)
        {

            var minifier = new Minifier();
            var minifiedJs = minifier.MinifyJavaScript(content, new CodeSettings
            {
                EvalTreatment = EvalTreatment.MakeImmediateSafe,
                PreserveImportantComments = false
            });
            return minifiedJs;
        }


        [HttpPost, ValidateInput(false)]
        public JsonResult update(FormCollection fc)
        {

                dcJavaScript dc = new dcJavaScript();
                SProcParameters p = dc.UpdateParameters;
                p.Add("js_id", Converter.ToDBNullIfEmptyOrZero(fc["js_id"]));
                p.Add("page_id", Converter.ToDBNullIfEmptyOrZero(fc["page_id"]));
                p.Add("js_content", Converter.ToDBNullIfEmptyOrZero(fc["js_content"]));
                p.Add("user_id", Converter.ToDBNullIfEmptyOrZero(CurrentUser.userId));
                p.Add("new_id", System.Data.SqlDbType.Int, System.Data.ParameterDirection.Output);
                dc.Execute(SQLCommandType.Update);                    
                return Json(new { js_id = p.GetItem("new_id").Value });
        }

        public JsonResult allBackup()
        {
            generateBackup(false);
            return Json(new { status = "ok" });      
        }

        public JsonResult selfBackup()
        {
                generateBackup(true);
                return Json(new { status = "ok" });

        }
        public static void generateBackup(bool selfBackup) {

            dcJavaScript dc = new dcJavaScript();
            List<javascript_v> list = dc.CreateBackup(selfBackup);
            foreach (javascript_v info in list)
            {
                if (info.page_name != "")
                {
                    var user_folder = "";
                    if (selfBackup) user_folder = SessionHandler.CurrentUser.userName + @"\";
                    AppSettings.WriteFile(user_folder + @"js\", info.page_name + ".js", info.js_content);
                }
            }
           
        }

    }
}