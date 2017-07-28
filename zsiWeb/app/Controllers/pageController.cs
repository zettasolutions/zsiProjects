using System;
using System.Collections.Generic;
using System.Web.Mvc;
using zsi.web.Models;
namespace zsi.web.Controllers
{
    public class pageController : baseController
    {
        // GET: Page
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

        public ActionResult name(string param1)
        {
            param1 = param1.ToLower();
            param1 = (param1 != null ? param1 : "");
            if (CurrentUser.userName == null)
            {
                setRequestedURL();
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
                  if (param1 != devURL && param1 != "signin")
                {
                    if (Session["zsi_login"].ToString() == "N")
                    return Redirect(Url.Content("~/") + "page/name/" + devURL);
                }
                if ((param1 == "selectoption" || param1 == "masterpages" || param1 == "table" || param1 == "filemanager" || param1 == "tablelayout" || param1 == "errors" || param1 == "appprofile")
                     && (Session["zsi_login"] == null || (Session["zsi_login"].ToString() == "N"))
                )
                    return Redirect(Url.Content("~/"));

                setPageLinks(param1);
                return View();
            }
        }



        [HttpPost]
        public ActionResult loginAdmin()
        {
            dcAppProfile dc = new dcAppProfile();
            appProfile info = dc.GetInfo();
            if (Request["user_name"] == "zsidev" && Request["user_pwd"] == info.developer_key)
            {
                Session["zsi_login"] = "Y";
                Response.Cookies["zsi_login"].Value = "Y";
                Response.Cookies["zsi_login"].Expires = DateTime.Now.AddDays(1);
                return Redirect(gePriorityURL(Url.Content("~/") + "page/name/" + info.default_page));
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