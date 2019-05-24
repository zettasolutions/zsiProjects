using System;
using System.Web.Mvc;
using zsi.web.Models;
namespace zsi.web.Controllers
{
    public class PageController : BaseController
    {
        const string defaultCtrl = "page/";
        // GET: Page
        public ActionResult Index()
        {
            try
            {
               using (new impersonate())
               {
                    if (this.isAuthorizedUser())
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
            }
            catch (Exception ex)
            {
                return Content("{errMsg:'" + ex.Message + "'}", "application/json");
            }
        }

        public ActionResult name(string pageName)
        {

           var _debug = "";
            try
            {
                using (new impersonate())
                {
                    pageName = pageName.ToLower();
                    pageName = (pageName != null ? pageName : "");

                    //return Content("test:" + SessionHandler.AppConfig.system_pages);
                    if (SessionHandler.CurrentUser.userName == null)
                    {
                        setRequestedURL();
                        return Redirect(Url.Content("~/"));
                    }
                    else
                    {
                        if (this.AppConfig ==null) {
                            dcAppProfile dc = new dcAppProfile();
                            appProfile info = dc.GetInfoByCurrentUser();
                            SessionHandler.AppConfig = info;
                        }
                      
                        string devURL = "zsiuserlogin";
                        if (pageName == "signin")
                        {
                            Session["zsi_login"] = "N";
                            Session["authNo"] = null;
                            Response.Cookies["zsi_login"].Expires = DateTime.Now.AddDays(-2);
                            Response.Cookies["username"].Expires = DateTime.Now.AddDays(-2);
                            Response.Cookies["isMenuItemsSaved"].Expires = DateTime.Now.AddDays(-2);
                            Session.Abandon();
                            return Redirect(Url.Content("~/"));
                        }
                        if (pageName != devURL && pageName != "signin")
                        {

                            if (this.CurrentUser.isDeveloper == "Y")
                            {
                                if (!this.isAuthorizedUser())
                                    return Redirect(Url.Content("~/") + defaultCtrl + devURL);
                            }

                        }

                        if (this.AppConfig.system_pages.ToLower().Contains(pageName.ToLower()) && !this.isAuthorizedUser()) return Redirect(Url.Content("~/"));
                        setPageLinks(pageName);
                        return View();
                        
                    }
                }
            }
            catch (Exception ex)
            {
                //return Content("{errMsg:\"" + ex.Message + "\"}", "application/json");
                return Content(ex.Message + "-" + _debug);
            }        
        }
        
        [HttpPost]
        public ActionResult loginAdmin()
        {
            try
            {
                if (Request["user_name"] == "zsidev" && Request["user_pwd"] == this.AppConfig.developer_key)
                {
                    Session["zsi_login"] = "Y";
                    Response.Cookies["zsi_login"].Value = "Y";
                    Response.Cookies["zsi_login"].Expires = DateTime.Now.AddDays(1);
                    return Redirect(gePriorityURL(Url.Content("~/") + defaultCtrl + this.AppConfig.default_page));
                }
                else
                {
                    Session["zsi_login"] = "N";
                    return Redirect(Url.Content("~/") + defaultCtrl + "zsiUserLogin");
                }
            }
            catch (Exception ex)
            {
                return Content("{errMsg:'" + ex.Message + "'}", "application/json");
            }

        }
      
    }
}