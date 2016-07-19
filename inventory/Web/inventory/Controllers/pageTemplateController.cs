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
    public class pageTemplateController : baseController
    {

        public ActionResult Index()
        {
            if (CurrentUser.username == null)
                return Redirect(Url.Content("~/"));
            else
            {
                setPageLinks("admin");
                return View();
            }

        }

        public ActionResult source(string param1)
        {
            if (CurrentUser.username == null)
                return Redirect(Url.Content("~/"));
            else
            {

                page_template_v d = new dcPageTemplate().GetInfo(param1);
                ViewBag.ptId = d.pt_id; ;
                ViewBag.pageId = d.page_id;
                ViewBag.pageTitle = d.page_title;
                ViewBag.ptContent = d.pt_content;
                return View();

            }

        }


        [HttpPost, ValidateInput(false)]
        public JsonResult update(FormCollection fc)
        {

            dcPageTemplate dc = new dcPageTemplate();
            SProcParameters p = dc.UpdateParameters;
            p.Add("pt_id", Converter.ToDBNullIfEmptyOrZero(fc["pt_id"]));
            p.Add("page_id", Converter.ToDBNullIfEmptyOrZero(fc["page_id"]));
            p.Add("pt_content", Converter.ToDBNullIfEmptyOrZero(fc["pt_content"]));
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

        private void generateBackup(bool selfBackup)
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