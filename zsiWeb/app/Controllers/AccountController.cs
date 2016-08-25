using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace zsi.web.Controllers
{
    using zsi.web.Models;

    public class AccountController : baseController
    {

        [HttpPost]
        public ActionResult validate()
        {
            string userName = Request["username"];
            string userPassword = Request["password"];
            user _user = new dcUser().getUserInfo(userName, userPassword);
            if (_user.userId > 0){
                Session["isAuthenticated"] = "Y";
                HttpContext.Response.Cookies["isMenuItemsSaved"].Value = "N";
                SessionHandler.CurrentUser = _user;
                return Redirect(Url.Content("~/") );

            }
            else
            {

                return Redirect(Url.Content("~/") + "?access=invalid" );
            }
        }
    }
 
}