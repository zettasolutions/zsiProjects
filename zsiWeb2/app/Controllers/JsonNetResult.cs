using System;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.Text;
using Newtonsoft.Json.Converters;

namespace zsi.web.Controllers
{
    public class JsonNetResult : JsonResult
    {
        public JsonNetResult()
        {
            this.ContentType = "application/json";
        }

        public JsonNetResult(object data, string contentType, Encoding contentEncoding, JsonRequestBehavior jsonRequestBehavior)
        {
            this.ContentEncoding = contentEncoding;
            this.ContentType = !string.IsNullOrWhiteSpace(contentType) ? contentType : "application/json";
            this.Data = data;
            this.JsonRequestBehavior = jsonRequestBehavior;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");

            var response = context.HttpContext.Response;

            response.ContentType = !String.IsNullOrEmpty(ContentType) ? ContentType : "application/json";

            if (ContentEncoding != null)
                response.ContentEncoding = ContentEncoding;

            if (Data == null)
                return;

            //var serializedObject = JsonConvert.SerializeObject(Data, Formatting.None);
            var serializedObject = JsonConvert.SerializeObject(Data, Formatting.None, new IsoDateTimeConverter() { DateTimeFormat = "MM/dd/yyyy HH:mm tt" });

            serializedObject = serializedObject.Replace(":null", ":\"\"");
            response.Write(serializedObject);
        }
    }

}