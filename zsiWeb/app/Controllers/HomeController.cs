using zsi.web.Models;
using System.Web.Mvc;
namespace zsi.web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            if (Session["isAuthenticated"] != null)
            {
                dcAppProfile dc = new dcAppProfile();
                appProfile info = dc.GetInfo();
                Session["appProfile"] = info;
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