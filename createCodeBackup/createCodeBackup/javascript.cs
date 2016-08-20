namespace createCodeBackup
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;

    public class javascript
    {
        public javascript(SqlDataReader SqlDataReader) {
            this.SqlDataReader = SqlDataReader;
        }
        public int? js_id { get; set; }
        public string js_content { get; set; }
        public string page_name { get; set; }


        public SqlDataReader SqlDataReader
        {
            set
            {
                SqlDataReader reader = value;
                if (reader["js_id"] != DBNull.Value)
                {
                    this.js_id = (int)reader["js_id"];
                }
                if (reader["js_content"] != DBNull.Value)
                {
                    this.js_content = (string)reader["js_content"];
                }

                if (reader["page_name"] != DBNull.Value)
                {
                    this.page_name = (string)reader["page_name"];
                }

            }
        }


    }
    public class dcJavaScript
    {

        public List<javascript> getMyFiles()
        {
            try
            {
                SqlConnection conn = new SqlConnection(settings.dbConnectionString);

                SqlCommand command = new SqlCommand("dbo.javascripts_sel", conn);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@self_backup", 1));
                conn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                List<javascript> _list = new List<javascript>();
                while (reader.Read())
                {
                    _list.Add(new javascript(reader));
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

