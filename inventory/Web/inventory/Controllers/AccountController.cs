using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace zsiInventory.Controllers
{
    using zsiInventory.Models;

    public class AccountController : baseController
    {

        private user validateUser(string userName, string password) {
            dcUser dc = new dcUser();
            return dc.getUserInfo(userName,password);
        }


        [HttpPost]
        public ActionResult validate()
        {
            string userName = Request["username"];
            string userPassword = Request["password"];

            user _user = validateUser(userName, userPassword);
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