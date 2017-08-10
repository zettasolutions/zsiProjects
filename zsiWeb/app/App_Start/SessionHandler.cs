using System.Web;

using zsi.web.Models;
namespace zsi.web
{
    public static class SessionHandler
    {
        public static user CurrentUser
        {
            get
            {
                if (HttpContext.Current.Session["User"] == null)
                { return new user(); }
                else
                { return (user)HttpContext.Current.Session["User"]; }
            }
            set
            { HttpContext.Current.Session["User"] = value; }

        }


        public static appProfile AppConfig
        {
            get
            {
                try
                {

                    return (appProfile)HttpContext.Current.Session["appProfile"];
                }
                catch
                {
                    HttpContext.Current.Session["appProfile"] = new dcAppProfile().GetInfo();
                    return (appProfile)HttpContext.Current.Session["appProfile"];
                }
            }
            set { HttpContext.Current.Session["appProfile"] = value; }

        }




    }
}
