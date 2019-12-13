using System;
using System.Web.Mvc;
using zsi.web.Models;

namespace zsi.web.Controllers
{
    public class ApiController : APIBaseController
    {
        [HttpPost]
        public ContentResult Update()
        {
            try
            {
                using (new impersonate())
                {

                    return Content(DataHelper.ProcessRequest(HttpContext.Request, DataHelper.ExecutionType.NonQuery), "application/json");
                }
            }
            catch (Exception ex)
            {
                return Content("{errMsg:'" + ex.Message + "'}", "application/json");
            }
        }

        [HttpPost]
        public ContentResult GetRecords()
        {
            try
            {
                using (new impersonate())
                {
                    return Content(DataHelper.ProcessRequest(HttpContext.Request, DataHelper.ExecutionType.Reader), "application/json");
                }
            }
            catch (Exception ex)
            {
                return Content("{errMsg:'" + ex.Message + "'}", "application/json");
            }
        }

        public ContentResult GetRecords2()
        {
            try
            {
                using (new impersonate())
                {
                    return Content(DataHelper.ProcessRequest(HttpContext.Request, DataHelper.ExecutionType.Reader, JsonRowsFormat.Array), "application/json");
                }
            }
            catch (Exception ex)
            {
                return Content("{errMsg:'" + ex.Message + "'}", "application/json");
            }
        }

    }
}