namespace createCodeBackup
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;
     
    public class dcView
    {

        public List<fileModel> getList()
        {
            try
            {
                SqlConnection conn = new SqlConnection(settings.dbConnectionString);

                SqlCommand command = new SqlCommand("SELECT TABLE_NAME, VIEW_DEFINITION from INFORMATION_SCHEMA.VIEWS", conn);
                conn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                List<fileModel> _list = new List<fileModel>();
                while (reader.Read())
                {
                    _list.Add(new fileModel { fileName = reader["TABLE_NAME"].ToString(),content=reader["VIEW_DEFINITION"].ToString() } );
                }
                reader.Close();
                conn.Close();
                return _list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


    }

}

