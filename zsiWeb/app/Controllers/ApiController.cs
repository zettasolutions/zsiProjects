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

        [HttpPost]
        public ContentResult SendEmail()
        {
            var ec = new EmailController();
            return ec.SendEmail(Request["to"], Request["subject"], Request["body"], Request["cc"], Request["bcc"]);
        }


        [HttpGet]
        public ActionResult ValidateEmail(string code)
        {
            string res = "";
            try
            {
                //compare code here
                res = CreateMessageJSONStr(true, "Email has been successfully validated.");
            }
            catch (Exception ex)
            {
                res = CreateMessageJSONStr(false, ex.Message.ToString());

            }

            return Content(res, "application/json");

        }

        private static string CreateMessageJSONStr(bool isSuccess, string msg = "")
        {
            return "{\"isSuccess\":" + isSuccess.ToString().ToLower()
                + ",\"message\":\"" + msg + "\""
                + "}";

        }
    }
}