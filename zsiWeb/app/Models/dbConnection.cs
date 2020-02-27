namespace zsi.web.Models
{
    using System.Configuration;
    using System.Data.SqlClient;

    public static class dbConnection
    {
        public static string ConnectionString
        {
            get { return ConfigurationManager.ConnectionStrings["ConnStr"].ConnectionString; }
        }

        public static SqlConnectionStringBuilder GetAttributes
        {
            get { return new SqlConnectionStringBuilder(ConnectionString); }
        }


        public static SqlConnection ConnectDb() {

            return new SqlConnection(dbConnection.ConnectionString);

        }
        


    }
}
