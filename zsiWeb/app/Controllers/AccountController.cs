using System.Web.Mvc;
namespace zsi.web.Controllers
{
    using zsi.web.Models;
    using zsi.Framework.Security;
    public class AccountController : baseController
    {
        [HttpPost]
        public ActionResult validate()
        {
            Cryptography crypt = new Cryptography();
            string userName = Request["username"];
            string userPassword = Request["password"];
            user _user = new dcUser().getUserInfo(userName);
            if (crypt.Decrypt(_user.password) == userPassword)
            {
                Session["isAuthenticated"] = "Y";
                HttpContext.Response.Cookies["isMenuItemsSaved"].Value = "N";
                SessionHandler.CurrentUser = _user;
                return Redirect(gePriorityURL(Url.Content("~/")));
            }
            else
            {
                return Redirect(Url.Content("~/") + "?access=invalid");
            }
        }


        public ActionResult changePassword()
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


        public ContentResult getNewPassword(string pwd)
        {
            return Content( new Cryptography().Encrypt(pwd));
        }

        public ContentResult dCrypt(string pwd)
        {
            return Content(new Cryptography().Decrypt(pwd));
        }
    }
 
}