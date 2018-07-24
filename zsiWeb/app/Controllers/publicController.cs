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
            try
            {
                pageName = pageName.ToLower();
                pageName = (pageName != null ? pageName : "");

                if (pageName == "encrypt")
                {
                    return Content(new Cryptography().Encrypt(Request["text"]));

                }

                setPageLinks(pageName, "Y");
                return View();
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
        }



    }
}