using System.Collections.Generic;
using System.Web.Mvc;
using zsi.web.Models;
using zsi.DataAccess;
using zsi.DataAccess.Provider.SQLServer;
using zsi.Framework.Common;
using Microsoft.Ajax.Utilities;

namespace zsi.web.Controllers
{
    public class javaScriptController : baseController
    {

        public ActionResult Index()
        {
            if (Session["zsi_login"] != null && (Session["zsi_login"].ToString() == "Y"))
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

        public ActionResult source(string param1)
        {
            if (CurrentUser.userName == null)
                return Redirect(Url.Content("~/"));
            else
            {

                javascript_v d = new dcJavaScript().GetInfo(param1);
                page_v page = new dcPage().GetPageByName(param1);
                ViewBag.jsId = d.js_id;
                ViewBag.pageId = page.page_id;
                ViewBag.pageTitle = page.page_title;
                ViewBag.jsContent = d.js_content;
                return View();
                
            }
        }

        public ActionResult name(string param1)
        {
            if (CurrentUser.userName == null)
                return Redirect(Url.Content("~/"));
            else
            {
                var r = new dcJavaScript().GetInfo(param1).js_content;
                if(this.AppConfig.is_source_minified =="Y") r = JsMinify(r);
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


        private void generateBackup(bool selfBackup) {

            dcJavaScript dc = new dcJavaScript();
            List<javascript_v> list = dc.CreateBackup(selfBackup);
            foreach (javascript_v info in list)
            {
                if (info.page_name != "")
                    AppSettings.WriteFile("js\\", info.page_name + ".js", info.js_content);

            }
           
        }

    }
}