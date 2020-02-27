namespace zsi.web.Models
{
    using System;
    using System.Data;
    using System.Data.SqlClient;
    public class EmailSettings
    {

        public string email_host { get; set; }
        public int email_port { get; set; }
        public string email_add { get; set; }
        public string email_add_desc { get; set; }
        public string email_pwd { get; set; }
        public bool email_is_ssl { get; set; }

        public SqlDataReader SqlDataReader
        {
            set
            {
                SqlDataReader reader = value;
                if (reader["email_host"] != DBNull.Value)
                {
                    this.email_host = (string)reader["email_host"];
                }
                if (reader["email_port"] != DBNull.Value)
                {
                    this.email_port = (int)reader["email_port"];
                }
                if (reader["email_add"] != DBNull.Value)
                {
                    this.email_add = (string)reader["email_add"];
                }
                if (reader["email_add_desc"] != DBNull.Value)
                {
                    this.email_add_desc = (string)reader["email_add_desc"];
                }
                if (reader["email_pwd"] != DBNull.Value)
                {
                    this.email_pwd = (string)reader["email_pwd"];
                }

                if (reader["email_is_ssl"] != DBNull.Value)
                {
                    this.email_is_ssl = (string)reader["email_is_ssl"] == "Y" ? true : false;  
                }
       
            }
        }
    }


    public class dcEmailSettings : EmailSettings, IDisposable
    {
        public dcEmailSettings() { }
        public dcEmailSettings(SqlDataReader reader)
        {
            this.SqlDataReader = reader;
        }
        public void Dispose() {
            SqlDataReader = null;
        }
        public dcEmailSettings GetInfo()
        {
            try
            {
                SqlConnection dbConn = dbConnection.ConnectDb();
                string sql = string.Format("select email_host,email_port,email_add,email_add_desc,email_pwd,email_is_ssl from app_profile");
                SqlCommand command = new SqlCommand(sql, dbConn);
                dbConn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                var _info = new dcEmailSettings();
                while (reader.Read())
                {
                    _info.SqlDataReader = reader;
                }
                reader.Close();
                dbConn.Close();
                return _info;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
       

    }
}