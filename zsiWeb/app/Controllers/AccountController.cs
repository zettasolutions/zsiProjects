using System.Web.Mvc;
namespace zsi.web.Controllers
{
    using zsi.web.Models;
    using zsi.Framework.Security;
    using System;

    public class AccountController : BaseController
    {
        private  ContentResult setMsg(string message,bool isSuccess)
        {
            return Content(

                "{\"isSuccess\":\"" + isSuccess.ToString().ToLower()  + "\",\"msg\":\"" + message + "\"}", "application/json"); 
        }

        [HttpPost]
        public ActionResult validate()
        {
            try
            {

                Cryptography crypt = new Cryptography();
                user _user = null;
                string userName = Request["username"];
                string userPassword = Request["password"];

                var verifyAndGetURL = new Func<string>(() =>{
                    _user = new dcUser().getUserInfo(userName);

                    if (_user.userName == null)
                    {
                        return Url.Content("~/ ") + " ? access = Username not exist.";
                    }

                    Session["isAuthenticated"] = "Y";
                    HttpContext.Response.Cookies["isMenuItemsSaved"].Value = "N";
                    SessionHandler.CurrentUser = _user;
                    SessionHandler.CurrentUser.password = userPassword;
                    SessionHandler.NotIncludeInCompression = DataHelper.GetDataTable(string.Format("dbo.zNoCompressionActions_sel"));

                    return gePriorityURL(Url.Content("~/"));
                });
 

                if (dbConnection.GetAttributes.IntegratedSecurity == true)
                {
                    using (new impersonate(userName, userPassword))
                    {

                        return Redirect(verifyAndGetURL());
                    }
                }
                else {
                    return Redirect(verifyAndGetURL());
                }
            }
            catch (Exception ex)
            {
                if (ex.Message.ToLower().Contains("cannot open database"))
                {
                    string link = "";
                    System.Text.RegularExpressions.MatchCollection mc = System.Text.RegularExpressions.Regex.Matches(ex.Message, "\"(.*?)\"");
                    string dbParam = Url.Content("~/") + "account/setupDatabase?dbName=" +
                                     mc[0].Value.Replace("\"", "");
                    link = "<br />Do you want to setup a database? Click <a href=\"" + dbParam + "\">Yes";
                    return Content(ex.Message + link);
                }

                return Redirect(Url.Content("~/") + "?access=invalid&msg=" + ex.Message);

            }
        }

        [HttpPost]
        public ActionResult validate2()
        {
            try
            {

                Cryptography crypt = new Cryptography();
                string userName = Request["username"];
                string userPassword = Request["password"];
                user _user = new dcUser().getUserInfo(userName);


                var verifyGetURL = new Func<string>(() => {
                    _user = new dcUser().getUserInfo(userName);

                    if (_user.userName == null)
                    {
                        return Url.Content("~/ ") + " ? access = Username not exist.";
                    }

                    Session["isAuthenticated"] = "Y";
                    HttpContext.Response.Cookies["isMenuItemsSaved"].Value = "N";
                    SessionHandler.CurrentUser = _user;
                    SessionHandler.CurrentUser.password = userPassword;
                    SessionHandler.NotIncludeInCompression = DataHelper.GetDataTable(string.Format("dbo.zNoCompressionActions_sel"));

                    return gePriorityURL(Url.Content("~/"));
                });

                if (_user.userName == null)
                {

                    return setMsg("Username does not exist.",false);
                }
                else if (crypt.Decrypt(_user.password) == userPassword)
                {
                    Session["isAuthenticated"] = "Y";
                    HttpContext.Response.Cookies["isMenuItemsSaved"].Value = "N";
                    SessionHandler.CurrentUser = _user;
                    return setMsg("access granted.",true); 
                }
                else
                {
                    return setMsg("Invalid Access.",false);
                }
            }
            catch (Exception ex)
            {
                return setMsg(ex.Message,false);
            }
        }


        public ActionResult setupDatabase(string dbName)
        {
            string msg = "";
            try
            {
                using (new impersonate())
                {
                    DataBaseSetup.restorBackup(dbName);
                    return Redirect(Url.Content("~/"));
                }
            }
            catch (Exception ex)
            {
                msg = ex.Message;
            }

            return Content(msg);
        }

        public ActionResult changePassword()
        {
            try
            {
                using (new impersonate())
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
            }
            catch (Exception ex)
            {
                return Content(ex.Message);
            }
        }

        public ContentResult getNewPassword(string pwd)
        {
            try {
                pwd = pwd.Trim().ToLower().Replace("ñ", "n");
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