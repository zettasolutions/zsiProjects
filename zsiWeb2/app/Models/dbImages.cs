namespace zsi.web.Models
{
    using System;
    using System.Data;
    using System.Data.SqlClient;
    using System.Collections.Generic;

    public class dbImages
    {
        public int image_id { get; set; }
        public string image_name { get; set; }
        public string content_type { get; set; }
        public byte[] file { get; set; }

        public SqlDataReader SqlDataReader
        {
            set
            {
                SqlDataReader reader = value;
                if (reader["image_id"] != DBNull.Value)
                {
                    this.image_id = (int)reader["image_id"];
                }
                if (reader["image_name"] != DBNull.Value)
                {
                    this.image_name = (string)reader["image_name"];
                }
                if (reader["content_type"] != DBNull.Value)
                {
                    this.content_type = (string)reader["content_type"];
                }

                this.file = (byte[])reader["image_file"]  ;                
       
            }
        }
    }


    public class dcDbImages : SqlCmd, IDisposable
    {
        public dcDbImages() { }
        public dcDbImages(SqlDataReader reader)
        {
            this.SqlDataReader = reader;
        }
        public void Dispose() {
            SqlDataReader = null;
        }

        public IList<dbImages> GetAll (string sqlCode)
        {
            try
            {
                SqlConnection dbConn = new SqlConnection(dbConnection.ConnectionString);
                SqlCommand cmd = new SqlCommand(new dcSqlCmd().GetInfo(sqlCode).text, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;
                var p = cmd.Parameters;
                dbConn.Open();
                SqlDataReader reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                IList<dbImages> list = new List<dbImages>(); 
                while (reader.Read())
                {
                    dbImages _info = new dbImages();
                    _info.SqlDataReader = reader;
                    list.Add(_info);
                }
                reader.Close();
                dbConn.Close();
                return list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public dbImages GetInfo(string sqlCode, int imageId)
        {
            try
            {
                SqlConnection dbConn = new SqlConnection(dbConnection.ConnectionString);
                SqlCommand cmd = new SqlCommand(new dcSqlCmd().GetInfo(sqlCode).text, dbConn);
                cmd.CommandType = CommandType.StoredProcedure;
                var p = cmd.Parameters;
                p.AddWithValue("@image_id", imageId);
                dbConn.Open();
                SqlDataReader reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                dbImages _info = new dbImages();
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

        public int Update(string sqlCode, dbImages info)
        {
            try
            {
                SqlConnection dbConn = new SqlConnection(dbConnection.ConnectionString);
                SqlCommand cmd = new SqlCommand(new dcSqlCmd().GetInfo(sqlCode).text, dbConn);
                int returnValue = 0;
                dbConn.Open();
                cmd.CommandType = CommandType.StoredProcedure;
                var p = cmd.Parameters;
                if (info.image_id != 0) p.AddWithValue("@image_id", info.image_id);
                cmd.CommandTimeout = 3600;
                p.AddWithValue("@image_name", info.image_name);
                p.AddWithValue("@content_type", info.content_type);
                p.AddWithValue("@user_id", SessionHandler.CurrentUser.userId);
                SqlParameter retval = new SqlParameter();
                retval.ParameterName = "@return_value";
                retval.SqlDbType = SqlDbType.Int;
                retval.Direction = ParameterDirection.ReturnValue;
                cmd.Parameters.Add(retval);
                cmd.ExecuteNonQuery();
                returnValue = Convert.ToInt32(retval.Value);
                dbConn.Close();
                return returnValue;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


    }
}