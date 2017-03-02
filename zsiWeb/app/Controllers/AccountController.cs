using System.Web.Mvc;
namespace zsi.web.Controllers
{
    using zsi.web.Models;
    using zsi.Framework.Security;
    using System;

    public class AccountController : baseController
    {
        [HttpPost]
        public ActionResult validate()
        {
            try
            {
                Cryptography crypt = new Cryptography();
                string userName = Request["username"];
                string userPassword = Request["password"];
                user _user = new dcUser().getUserInfo(userName);
                if (_user.userName == null){
                    return Redirect(Url.Content("~/") + "?access=Username not exist.");
                }
                else if (crypt.Decrypt(_user.password) == userPassword)
                {
                    Session["isAuthenticated"] = "Y";
                    HttpContext.Response.Cookies["isMenuItemsSaved"].Value = "N";
                    SessionHandler.CurrentUser = _user;
                    return Redirect(gePriorityURL(Url.Content("~/")));
                }
                else
                {
                    return Redirect(Url.Content("~/") + "?access=Invalid Access.");
                }
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
        }


        public ActionResult changePassword()
        {
            try
            {
                Cryptography crypt = new Cryptography();
                string oldPassword = Request["old_password"];
                string newPassword = crypt.Encrypt(Request["new_password"]);
                user _user = new dcUser().getUserInfo(this.CurrentUser.userName);
                if (crypt.Decrypt(_user.password) == oldPassword)
                {
                    new dcUser().changePassword(newPassword);
                    return Redirect(gePriorityURL(Url.Content("~/")));
                }
                else
                {
                    return Redirect(Url.Content("~/") + "page/name/changepassword?msg=invalid");
                }
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
        }

        public ContentResult getNewPassword(string pwd)
        {
            try {
                return Content(new Cryptography().Encrypt(pwd));
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
        }

        public ContentResult dCrypt(string pwd)
        {
            try
            {
                return Content(new Cryptography().Decrypt(pwd));
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
        }
    }
 
}