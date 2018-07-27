using zsi.web.Models;
using System.Web.Mvc;
namespace zsi.web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            dcAppProfile dc = new dcAppProfile();

            if (Session["isAuthenticated"] != null)
            {
                appProfile info = dc.GetInfoByCurrentUser();
                SessionHandler.AppConfig = info;
                return Redirect(Url.Content("~/") + "page/" + info.default_page);

            }
            else
            {
                if(SessionHandler.AppConfig ==null) SessionHandler.AppConfig = dc.GetInfo();
                return View();
            }
        }
        public ActionResult SignIn()
        {
            return Redirect(Url.Content("~/"));
        
        }
    }
}