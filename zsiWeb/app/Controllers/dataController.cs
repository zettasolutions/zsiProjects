using System.Web.Mvc;
namespace zsi.web.Controllers
{
    public class DataController : BaseController
    {
        [HttpPost]
        public ContentResult Update()
        {

            return Content(DataHelper.ProcessRequest(HttpContext.Request,DataHelper.ExecutionType.NonQuery), "application/json");
        }

        [HttpPost]
        public ContentResult GetRecords()
        {
            return Content(DataHelper.ProcessRequest(HttpContext.Request, DataHelper.ExecutionType.Reader), "application/json");
        }
    }
}