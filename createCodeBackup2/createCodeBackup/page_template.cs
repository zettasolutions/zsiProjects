namespace createCodeBackup
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;

    public class page_template
    {
        public page_template(SqlDataReader reader)
        {
            this.SqlDataReader = reader;
        }
        public int? pt_id { get; set; }
        public string pt_content { get; set; }
        public string page_name { get; set; }
        public SqlDataReader SqlDataReader
        {
            set
            {
                SqlDataReader reader = value;
                if (reader["pt_id"] != DBNull.Value)
                {
                    this.pt_id = (int)reader["pt_id"];
                }
                if (reader["pt_content"] != DBNull.Value)
                {
                    this.pt_content = (string)reader["pt_content"];
                }

                if (reader["page_name"] != DBNull.Value)
                {
                    this.page_name = (string)reader["page_name"];
                }
            }
        }
    }


    public class dcPage_template
    {
        public List<page_template> getMyFiles()
        {
            try
            {
                SqlConnection conn = new SqlConnection(settings.dbConnectionString);
                SqlCommand command = new SqlCommand("dbo.page_templates_sel", conn);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@self_backup",1));
                conn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                List<page_template> _list = new List<page_template>();
                while (reader.Read())
                {
                    _list.Add(new page_template(reader));
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



 

 