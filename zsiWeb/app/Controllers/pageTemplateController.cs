using System.Collections.Generic;
using System.Web.Mvc;

using zsi.web.Models;
using zsi.DataAccess;
using zsi.DataAccess.Provider.SQLServer;
using zsi.Framework.Common;

namespace zsi.web.Controllers
{
    public class PageTemplateController : BaseController
    {

        public ActionResult Index()
        {
            if ( this.isAuthorizedUser())
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
            if (this.isAuthorizedUser())
            {
                page_template_v d = new dcPageTemplate().GetInfo(pageName);
                ViewBag.ptId = d.pt_id; ;
                ViewBag.pageId = d.page_id;
                ViewBag.pageTitle = d.page_title;
                ViewBag.ptContent = d.pt_content;
                return View();
            }
            else return this.ShowNotAllowedPage();
        }


        [HttpPost, ValidateInput(false)]
        public JsonResult update(FormCollection fc)
        {

            dcPageTemplate dc = new dcPageTemplate();
            SProcParameters p = dc.UpdateParameters;
            p.Add("pt_id", Converter.ToDBNullIfEmptyOrZero(fc["pt_id"]));
            p.Add("page_id", Converter.ToDBNullIfEmptyOrZero(fc["page_id"]));
            p.Add("pt_content", Converter.ToDBNullIfEmptyOrZero(fc["pt_content"]));
            p.Add("user_id", Converter.ToDBNullIfEmptyOrZero(CurrentUser.userId));
            p.Add("new_id", System.Data.SqlDbType.Int, System.Data.ParameterDirection.Output);
            dc.Execute(SQLCommandType.Update);
            return Json(new { pt_id = p.GetItem("new_id").Value });

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

        public static void generateBackup(bool selfBackup)
        {

            dcPageTemplate dc = new dcPageTemplate();
            List<page_template_v> list = dc.CreateBackup(selfBackup);
            foreach (page_template_v info in list)
            {
                if (info.page_name != "")
                    AppSettings.WriteFile("template\\", info.page_name + ".html", info.pt_content);
            }
           
        }


    }
}