namespace createCodeBackup
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;

    public class dcProcedure
    {

        public List<fileModel> getList()
        {
            try
            {
                SqlConnection conn = new SqlConnection(settings.dbConnectionString);
                SqlConnection conn1 = new SqlConnection(settings.dbConnectionString);

                SqlCommand command = new SqlCommand("select SPECIFIC_NAME from information_schema.routines order by routine_type", conn);
                conn.Open();
               
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                List<fileModel> _list = new List<fileModel>();
                while (reader.Read())
                {
                    string text = "";
                    conn1.Open();                    
                    SqlCommand command1 = new SqlCommand("sp_helptext " + reader["SPECIFIC_NAME"].ToString(), conn1);
                    SqlDataReader reader1 = command1.ExecuteReader(CommandBehavior.CloseConnection);
                    while (reader1.Read())
                    {
                        text += reader1["Text"].ToString();
                    }
                    _list.Add(new fileModel { fileName = reader["SPECIFIC_NAME"].ToString(), content = text });
                    reader1.Close();
                    conn1.Close();
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

