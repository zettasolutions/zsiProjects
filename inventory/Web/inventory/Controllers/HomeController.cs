using zsiInventory.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace zsiInventory.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            if (Session["isAuthenticated"] != null)
            {

                dcAppProfile dc = new dcAppProfile();
                appProfile info = dc.GetInfo();
                return Redirect(Url.Content("~/") + "page/name/" + info.default_page);
              
            }
            else
                return View();  
        }
        public ActionResult SignIn()
        {
            return Redirect(Url.Content("~/"));
        
        }
    }
}