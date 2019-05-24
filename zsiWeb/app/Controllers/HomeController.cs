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
                    dcAppProfile dc = null;
                    if (Session["isAuthenticated"] != null)
                    {
                        dc = new dcAppProfile();
                        appProfile info = dc.GetInfoByCurrentUser();
                        SessionHandler.AppConfig = info;                        
                        return Redirect(Url.Content("~/") + "page/" + info.default_page);
                    }
                    else
                    {
                       //if (SessionHandler.AppConfig == null) SessionHandler.AppConfig = dc.GetInfo();
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