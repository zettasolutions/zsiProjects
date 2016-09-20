using System.Web.Mvc;

namespace zsi.web.Controllers
{
    public class sqlController : baseController
    {
        public ActionResult Index()
        {
            if (Session["zsi_login"] != null && (Session["zsi_login"].ToString() == "Y"))
                return View();
            else
                return Redirect(Url.Content("~/"));
        }

        public ContentResult Exec()
        {
               return this.toJSON(Request["p"],false); 
        }

        public ContentResult Proc()
        {
                return this.toJSON(Request["p"], true);
            
        }

        public ContentResult LogError()
        {
                return this.toJSON(Request["p"],true);
            
        }

    }
}