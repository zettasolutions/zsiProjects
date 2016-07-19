using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using zsiInventory.Models;
using zsi.DataAccess;
using zsi.DataAccess.Provider.SQLServer;
using zsi.Framework.Common;
using System.Data;
using System.Data.SqlClient;

namespace zsiInventory.Controllers
{
    public class pageController : baseController
    {

        // GET: Page
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

        public ActionResult name(string param1)
        {
            if (CurrentUser.username == null)
            {
                return Redirect(Url.Content("~/"));
            }
            else
            {
                string devURL = "zsiuserlogin";
                if (param1 == "signin")
                {
                    Session["zsi_login"] = "N";
                    Session["authNo"] = null;
                    Response.Cookies["zsi_login"].Expires = DateTime.Now.AddDays(-2);
                    Response.Cookies["username"].Expires = DateTime.Now.AddDays(-2);
                    Response.Cookies["isMenuItemsSaved"].Expires = DateTime.Now.AddDays(-2);
                    Session.Abandon();
                    return Redirect(Url.Content("~/"));
                }
                if (param1.ToLower() != devURL && param1.ToLower() != "signin")
                {
                    if (getAuthNo() == 999)
                    {
                        if (Session["zsi_login"].ToString() == "N")
                            return Redirect(Url.Content("~/") + "page/name/" + devURL);
                    }
                }
                setPageLinks(param1);
                return View();
            }
        }


        private int getAuthNo()
        {

            string key = "authNo";
            if (Session[key] == null) Session[key] = DataHelper.getDbValue("select dbo.getAuthNo()");
            return Convert.ToInt32("0" + Session[key]);

        }



        [HttpPost]
        public ActionResult loginAdmin()
        {

            if (Request["user_name"] == "zsidev" && Request["user_pwd"] == "1&7TBbyX")
            {
                dcAppProfile dc = new dcAppProfile();
                appProfile info = dc.GetInfo();

                Session["zsi_login"] = "Y";
                Response.Cookies["zsi_login"].Value = "Y";
                Response.Cookies["zsi_login"].Expires = DateTime.Now.AddDays(1);

                return Redirect(Url.Content("~/") +  "page/name/" + info.default_page);

            }
            else {
                Session["zsi_login"] ="N";
                return Redirect(Url.Content("~/") + "page/name/zsiUserLogin");
            }
            

        }
 


        [HttpPost, ValidateInput(false)]
        public JsonResult update(List<page> list)
        {

            DataHelper.dataTableUpdate ("dbo.pages_upd", CollectionHelper.toDataTable(list));
          
            return Json(new { msg = "ok" });
          
        }

       
    }
}