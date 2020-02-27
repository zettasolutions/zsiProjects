namespace zsi.web.Models
{

    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.SqlClient;

    public class dcDbObjects
    {
        #region "table"
        public List<fileModel> getTables()
        {
            try
            {
                SqlConnection conn = dbConnection.ConnectDb();
                SqlCommand command = new SqlCommand("SELECT TABLE_NAME from INFORMATION_SCHEMA.TABLES where TABLE_TYPE='BASE TABLE'", conn);
                conn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                List<fileModel> _list = new List<fileModel>();
                while (reader.Read())
                {
                    _list.Add(new fileModel { fileName = reader["TABLE_NAME"].ToString(), content = createTableCode(reader["TABLE_NAME"].ToString()) });

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
        public string createTableCode(string TableName)
        {
            try
            {
                string result = "CREATE TABLE " + TableName + "(";
                SqlConnection conn = dbConnection.ConnectDb();

                SqlCommand command = new SqlCommand("sp_columns", conn);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@table_name", TableName));
                conn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                string comma = "";
                while (reader.Read())
                {
                    string type = reader["TYPE_NAME"].ToString();
                    int size = Convert.ToInt32(reader["LENGTH"]);
                    int nullable = Convert.ToInt32(reader["NULLABLE"]);
                    result += "\r\n" + comma + reader["COLUMN_NAME"].ToString() + "\t" + (type.Contains("identity") ? type.ToUpper() + "(1,1)" : (type == "int" || type.Contains("date") ? type.ToUpper() : type.ToUpper() + "(" + size + ")")) + "\t" + (nullable == 0 ? "NOT NULL" : "NULL");
                    comma = ",";
                }
                reader.Close();
                conn.Close();
                return result + ")";
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        #region "table types"
        public List<fileModel> getTableTypes()
        {
            try
            {
                SqlConnection conn = dbConnection.ConnectDb();

                SqlCommand command = new SqlCommand("sp_table_types", conn);
                command.CommandType = CommandType.StoredProcedure;
                conn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                List<fileModel> _list = new List<fileModel>();
                while (reader.Read())
                {
                    _list.Add(new fileModel { fileName = reader["TABLE_NAME"].ToString(), content = createTableTypeCode(reader["TABLE_NAME"].ToString()) });

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
        public string createTableTypeCode(string TableName)
        {
            try
            {
                string result = "CREATE TYPE " + TableName + " AS TABLE(";
                SqlConnection conn = dbConnection.ConnectDb();

                SqlCommand command = new SqlCommand("sp_table_type_columns_100", conn);
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.Add(new SqlParameter("@table_name", TableName));
                conn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                string comma = "";
                while (reader.Read())
                {
                    string type = reader["TYPE_NAME"].ToString();
                    int size = Convert.ToInt32(reader["LENGTH"]);
                    int nullable = Convert.ToInt32(reader["NULLABLE"]);
                    result += "\r\n" + comma + reader["COLUMN_NAME"].ToString() + "\t" + (type.Contains("identity") ? type.ToUpper() + "(1,1)" : (type == "int" || type.Contains("date") ? type.ToUpper() : type.ToUpper() + "(" + size + ")")) + "\t" + (nullable == 0 ? "NOT NULL" : "NULL");
                    comma = ",";
                }
                reader.Close();
                conn.Close();
                return result + ")";
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion

        public List<fileModel> getProcedures()
        {
            try
            {
                SqlConnection conn = dbConnection.ConnectDb();
                SqlConnection conn1 = dbConnection.ConnectDb();

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
        public List<fileModel> getViews()
        {
            try
            {
                SqlConnection conn = dbConnection.ConnectDb();
                SqlCommand command = new SqlCommand("SELECT TABLE_NAME, VIEW_DEFINITION from INFORMATION_SCHEMA.VIEWS", conn);
                conn.Open();
                SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                List<fileModel> _list = new List<fileModel>();
                while (reader.Read())
                {
                    _list.Add(new fileModel { fileName = reader["TABLE_NAME"].ToString(), content = reader["VIEW_DEFINITION"].ToString() });
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