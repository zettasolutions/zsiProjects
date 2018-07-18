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

        public ActionResult name(string pageName)
        {
            pageName = pageName.ToLower();
            pageName = (pageName != null ? pageName : "");

            setPageLinks(pageName, "Y");
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