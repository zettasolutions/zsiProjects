using System.Web.Mvc;
using System.Net.Mail;
using System.Net;
using System;
using zsi.web.Models;
namespace zsi.web.Controllers
{
    public class EmailController : BaseController
    {

        public EmailController(){}

        private static string CreateMessageJSONStr(bool isSuccess, string msg="")
        {
            return "{\"isSuccess\":" + isSuccess.ToString().ToLower()
                +  ",\"message\":\"" + msg + "\"" 
                + "}";
        }

        [HttpPost]
        public ContentResult Send()
        {
            return SendEmail(Request["to"], Request["subject"], Request["body"], Request["cc"], Request["bcc"]);
        }

        public ContentResult SendEmail(string to, string subject, string body, string cc=null, string bcc =null)
        {
            string res = "";
            try
            {
                var info = new dcEmailSettings().GetInfo();
                var fromAddress = new MailAddress(info.email_add, info.email_add_desc);
                var smtp = new SmtpClient
                {
                    Host = info.email_host,
                    Port = info.email_port,
                    EnableSsl = info.email_is_ssl,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(info.email_add, info.email_pwd)
                };


                var msg = new MailMessage(info.email_add, to)
                {
                    Sender = fromAddress,
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true

                };
                if (cc != null) msg.CC.Add(new MailAddress(cc.ToString()));
                if (cc != null) msg.Bcc.Add(new MailAddress(cc.ToString()));

                smtp.Send(msg);

                res = CreateMessageJSONStr(true, "Message sent.");
            }
            catch (Exception ex)
            {
                res = CreateMessageJSONStr(false, ex.Message.ToString());

            }

            return Content(res, "application/json");

        }


    }
}