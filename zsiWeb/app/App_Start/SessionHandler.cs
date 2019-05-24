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
                if(HttpContext.Current.Session == null || HttpContext.Current.Session["User"] == null)
                { return new user(); }
                else
                { return (user)HttpContext.Current.Session["User"]; }
            }
            set
            { HttpContext.Current.Session["User"] = value; }

        }

        public static System.Data.DataTable NotIncludeInCompression
        {
            get
            {
                if (HttpContext.Current.Session["NotIncludeInCompression"] == null)
                { return new System.Data.DataTable(); }
                else
                { return (System.Data.DataTable)HttpContext.Current.Session["NotIncludeInCompression"]; }
            }
            set
            { HttpContext.Current.Session["NotIncludeInCompression"] = value; }

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
                    HttpContext.Current.Session["appProfile"] = new dcAppProfile().GetInfoByCurrentUser();
                    return (appProfile)HttpContext.Current.Session["appProfile"];
                }
            }
            set { HttpContext.Current.Session["appProfile"] = value; }

        }




    }
}
