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
    public class AccountController : baseController
    {

        [HttpPost]
        public ActionResult validate()
        {
            string userName = Request["username"];
            string userPassword = Request["password"];


            if (Membership.ValidateUser(userName, userPassword))
            {

                Session["isAuthenticated"] = "Y";
                HttpContext.Response.Cookies["isMenuItemsSaved"].Value = "N";
                SessionHandler.CurrentUser = new Models.user { username = userName, password = userPassword };
                    DataHelper.toJSON(
                        "dbo.users_pwd_upd @username='" + userName + "'"
                      + ",@password='" + userPassword + "'"
                      , false);
                    return Redirect(Url.Content("~/") );

            }
            else
            {

                return Redirect(Url.Content("~/") + "?access=invalid" );
            }
        }
    }
 
}