using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using zsiInventory.Models;
using zsi.DataAccess;
using zsi.DataAccess.Provider.SQLServer;
using zsi.Framework.Common;

namespace zsiInventory.Controllers
{
    public class javaScriptController : baseController
    {

        public ActionResult Index()
        {
            if (CurrentUser.userName == null)
                return Redirect(Url.Content("~/"));
            else
            {
                setPageLinks("admin");
                return View();
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

                return Content(new dcJavaScript().GetInfo(param1).js_content, "application/javascript");
                
            }
        }

        [HttpPost, ValidateInput(false)]
        public JsonResult update(FormCollection fc)
        {

                dcJavaScript dc = new dcJavaScript();
                SProcParameters p = dc.UpdateParameters;
                p.Add("js_id", Converter.ToDBNullIfEmptyOrZero(fc["js_id"]));
                p.Add("page_id", Converter.ToDBNullIfEmptyOrZero(fc["page_id"]));
                p.Add("js_content", Converter.ToDBNullIfEmptyOrZero(fc["js_content"]));
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