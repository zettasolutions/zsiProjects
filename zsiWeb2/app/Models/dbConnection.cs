namespace zsi.web.Models
{
    using System.Configuration;

    public static class dbConnection
    {
        public static string ConnectionString
        {
            get { return ConfigurationManager.ConnectionStrings["ConnStr"].ConnectionString; }
        }
    }
}
