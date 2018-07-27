using System.Web.Mvc;

namespace zsi.web.Controllers
{
    public class SqlController : BaseController
    {
        public ActionResult Index()
        {
            if ( this.isAuthorizedUser() )
                return View();
            else
                return Redirect(Url.Content("~/"));
        }

        public ContentResult Exec()
        {
               return this.ToJSON(Request["p"],false); 
        }

        public ContentResult Proc()
        {
                return this.ToJSON(Request["p"], true);
            
        }

        public ContentResult LogError()
        {
                return this.ToJSON(Request["p"],true);
            
        }

    }
}