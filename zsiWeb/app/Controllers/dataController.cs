using System.Web.Mvc;
namespace zsi.web.Controllers
{
    public class DataController : BaseController
    {
        [HttpPost]
        public JsonResult Update()
        {
            return Json(DataHelper.ProcessPostData(HttpContext.Request));
        }

        [HttpPost]
        public ContentResult GetRecords()
        {
            return Content(DataHelper.GetJSONData(HttpContext.Request), "application/json");
        }
    }
}