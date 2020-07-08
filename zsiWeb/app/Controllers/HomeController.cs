using zsi.web.Models;
using System.Web.Mvc;
using System;

namespace zsi.web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            try
            {

                using (new impersonate())
                {
                    dcAppProfile dc = new dcAppProfile(); ;
                    if (Session["isAuthenticated"] != null)
                    {
                        appProfile info = dc.GetInfoByCurrentUser();
                        SessionHandler.AppConfig = info;
                        return Redirect(Url.Content("~/") + "page/" + info.default_page);
                    }
                    else
                    {
                        string isADSecurity = System.Configuration.ConfigurationManager.AppSettings["ADSecurity"];
                        if (isADSecurity != null && bool.Parse(isADSecurity) == false)
                        {
                            appProfile info = dc.GetInfo();
                            SessionHandler.AppConfig = info;
                            ViewBag.appTitle = info.app_title;
                        }
                        return View();
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { errMsg = ex.Message }, JsonRequestBehavior.AllowGet);
            }

        }
        public ActionResult SignIn()
        {
            return Redirect(Url.Content("~/"));

        }
    }
}