using System;
using System.Web.Mvc;
using zsi.Framework.Security;
namespace zsi.web.Controllers
{
    public class publicController : baseController
    {
        // GET: Page
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult name(string param1)
        {
            param1 = param1.ToLower();
            param1 = (param1 != null ? param1 : "");

            setPageLinks(param1,"Y");
            return View();
           
        }

        public ContentResult enCrypt(string text)
        {
            try
            {
                return Content(new Cryptography().Encrypt(text));
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
        }


    }
}