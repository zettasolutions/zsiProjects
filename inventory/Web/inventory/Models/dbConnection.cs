namespace zsiInventory.Models
{
    using System;
    using System.Collections.Generic;

    using System.Data;
    using System.Data.SqlClient;
    using System.Configuration;

    public static class dbConnection
    {
        public static string ConnectionString
        {
            get { return ConfigurationManager.ConnectionStrings["ConnStr"].ConnectionString; }
        }
    }
}
