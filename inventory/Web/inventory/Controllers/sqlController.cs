using System.Web.Mvc;

namespace zsiInventory.Controllers
{
    public class sqlController : baseController
    {
        public ActionResult Index()
        {
            return View();
        }

        public ContentResult Exec()
        {
            using (new impersonate())
            {
               return this.toJSON(Request["p"],false); 
            }
            
        }

        public ContentResult Proc()
        {
            using (new impersonate())
            {
                return this.toJSON(Request["p"], true);
            }

            
        }

        public ContentResult LogError()
        {
            using (new impersonate())
            {
                return this.toJSON(Request["p"],true);
            }
            
        }

    }
}