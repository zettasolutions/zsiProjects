using System.Web;
using zsiInventory.Models;
using System.Data;
using System;
using System.Data.SqlClient;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace zsiInventory
{
    public class DataHelper
    {
        public DataHelper() { }
        #region "private static"
        private static string toJSON(SqlDataReader rdr)
        {
            StringBuilder sb = new StringBuilder();
            StringWriter sw = new StringWriter(sb);
            JsonWriter jsonWriter = new JsonTextWriter(sw);
            jsonWriter.WriteStartArray();
            while (rdr.Read())
            {
                int fieldcount = rdr.FieldCount; // count how many columns are in the row
                object[] values = new object[fieldcount]; // storage for column values
                rdr.GetValues(values); // extract the values in each column
                jsonWriter.WriteStartObject();
                for (int index = 0; index < fieldcount; index++)
                {

                    string colName = rdr.GetName(index);
                    object value = values[index];
                    jsonWriter.WritePropertyName(colName);

                    if (value == DBNull.Value)
                        value = "";
                    else if (colName.Contains("date") && !colName.Contains("by"))
                        value = String.Format("{0:MM/dd/yyyy HH:mm tt}", value);

                    jsonWriter.WriteValue(value);
                }
                jsonWriter.WriteEndObject();
            }
            jsonWriter.WriteEndArray();

            return sb.ToString();
        }
        private static string createMessageJSONStr(Message message )
        {
            return "{\"isSuccess\":" + message.isSuccess.ToString().ToLower()
                + ",\"recordsAffected\":" + message.recordsAffected
                + ",\"returnValue\":" + message.returnValue
                +",\"rows\":" + message.rows
                + ",\"errMsg\":\"" + message.errMsg + "\"}";
        }
        private static void serializeURLParameters(SqlCommand command, string sqlQuery)
        {

            int start = sqlQuery.IndexOf("@");
            if (start > -1)
            {
                string result = sqlQuery.Substring(start);
                if (start > 0) command.CommandText = sqlQuery.Substring(0, start - 1);

                string[] arr = result.Split(',');
                var p = command.Parameters;
                foreach (string item in arr)
                {
                    if (item.Contains("="))
                    {
                        string[] keyvalue = item.Split('=');

                        if (keyvalue[1] != "null" && keyvalue[1] != "")
                        {
                            if (item.Contains("'"))
                                p.Add(keyvalue[0], SqlDbType.VarChar).Value = keyvalue[1].Replace("'", "").Replace("|", ",");
                            else
                                p.Add(keyvalue[0], SqlDbType.Int).Value = Convert.ToInt32(keyvalue[1]);
                        }
                    }
                }
            }

        }
        #endregion

        public static Message dataTableUpdate(string procedureName, DataTable dt)
        {
            Message m = new Message();
            try
            {
                SqlConnection conn = new SqlConnection(dbConnection.ConnectionString);
                using (conn)
                {
                    SqlCommand cmd = new SqlCommand(procedureName, conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlParameter tvparam = cmd.Parameters.AddWithValue("@tt", dt);
                    tvparam.SqlDbType = SqlDbType.Structured;
                    SqlParameter retval = new SqlParameter();
                    retval.ParameterName = "@return_value";
                    retval.SqlDbType = SqlDbType.Int;
                    retval.Direction = ParameterDirection.ReturnValue;
                    cmd.Parameters.Add(retval);
                    conn.Open();
                    m.recordsAffected = cmd.ExecuteNonQuery();
                    m.returnValue = Convert.ToString(retval.Value);
                    conn.Close();
                }
                conn.Dispose();
                m.isSuccess = true;
            }
            catch (SqlException ex)
            {
                m.errNumber= ex.ErrorCode;
                m.errMsg = ex.Message;
                logError(ex.ErrorCode, procedureName + ",params:" + DataTableToJSON(dt), ex.Message, "E");
            }
            catch (Exception ex) {
                m.errMsg = ex.Message;
                logError(null, procedureName + ",params:" + DataTableToJSON(dt), ex.Message, "E");
            }
            return m;

        }



        public static string DataTableToJSON(DataTable table)
        {
            string JSONString = string.Empty;
            JSONString =  JsonConvert.SerializeObject(table);
            return JSONString;
        }
        public static void logError(int? errNumber, string procedure, string errMessage, string type) {

            SqlConnection conn = new SqlConnection(dbConnection.ConnectionString);
            using (conn)
            {
                SqlCommand cmd = new SqlCommand("dbo.error_logs_upd", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                if (errNumber != null) cmd.Parameters.AddWithValue("@error_no", errNumber);
                cmd.Parameters.AddWithValue("@page_url", "db:" + procedure);
                cmd.Parameters.AddWithValue("@error_msg", errMessage);
                cmd.Parameters.AddWithValue("@error_type", type);
                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
            }
            conn.Dispose();

        }
        public static string getDbValue(string sql) {
            SqlConnection conn = new SqlConnection(dbConnection.ConnectionString);
            SqlCommand cmd = new SqlCommand(sql, conn);
            string returnValue = "";
            cmd.CommandType = CommandType.Text;
            conn.Open();
            returnValue = Convert.ToString(cmd.ExecuteScalar());
            conn.Close();
            return returnValue;
        }


        public static string getGetRecordsByDataTable(string procedureName, DataTable dt)
        {
            String json = "";
            if (dt.Rows.Count == 0) {
                json = createMessageJSONStr(new Message
                {
                    isSuccess = true
                    ,recordsAffected = -1
                    ,rows = "[]"
                });
                return json;
            }

            SqlDataReader rdr = null;
            SqlConnection conn = null;
            String connectionString = string.Empty;

            try
            {
                conn = new SqlConnection(dbConnection.ConnectionString);
                using (conn)
                {
                    SqlCommand cmd = new SqlCommand(procedureName, conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlParameter tvparam = cmd.Parameters.AddWithValue("@tt", dt);
                    tvparam.SqlDbType = SqlDbType.Structured;

                    StringBuilder allJSONs = new StringBuilder();
                    conn.Open();
                    cmd.CommandTimeout = 3600;
                    SqlParameter retval = new SqlParameter();
                    retval.ParameterName = "@return_value";
                    retval.SqlDbType = SqlDbType.Int;
                    retval.Direction = ParameterDirection.ReturnValue;
                    cmd.Parameters.Add(retval);

                    rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                    json = toJSON(rdr);
                    rdr.Close();

                    if (json == "[]" && rdr.RecordsAffected > 0)
                        json = createMessageJSONStr(new Message
                        {
                            isSuccess = true
                            ,recordsAffected = rdr.RecordsAffected
                            ,rows = "[]"
                        });
                    else
                        json = createMessageJSONStr(new Message
                        {
                            isSuccess = true
                            ,recordsAffected = rdr.RecordsAffected
                            ,rows = json
                            ,returnValue = Convert.ToString(retval.Value)
                        });

                }
            }
            catch (SqlException sqlException)
            {
                json = createMessageJSONStr(new Message
                {
                    isSuccess = false
                    ,recordsAffected = -1
                    ,errMsg = sqlException.ToString()
                });

            }
            finally
            {
                conn.Close();
            }
            return json;

        }

        public static void execute(string sql, bool isProcedure) {
            toJSON(sql, isProcedure);
        }

        public static string toJSON(string sql, bool isProcedure)
        {
            SqlDataReader rdr = null;
            SqlConnection conn = null;
            SqlCommand command = null;
            String connectionString = string.Empty;
            String json = "";
            try
            {
                conn = new SqlConnection(dbConnection.ConnectionString);
                command = new SqlCommand(sql, conn);
                if (isProcedure){
                    serializeURLParameters(command, sql);
                    command.CommandType = CommandType.StoredProcedure;
                }

                StringBuilder allJSONs = new StringBuilder();
                conn.Open();
                command.CommandTimeout = 3600;
                SqlParameter retval = new SqlParameter();
                retval.ParameterName = "@return_value";
                retval.SqlDbType = SqlDbType.Int;
                retval.Direction = ParameterDirection.ReturnValue;
                command.Parameters.Add(retval);
               
                rdr = command.ExecuteReader(CommandBehavior.CloseConnection);
                json = toJSON(rdr);
                rdr.Close();

                if (json == "[]" && rdr.RecordsAffected > 0)
                    json = createMessageJSONStr(new Message {
                        isSuccess = true
                        , recordsAffected = rdr.RecordsAffected
                        , rows = "[]"
                    });
                else
                    json = createMessageJSONStr(new Message {
                        isSuccess = true
                        , recordsAffected = rdr.RecordsAffected
                        , rows = json
                        , returnValue = Convert.ToString(retval.Value)
                    });
                
            }
            catch (SqlException sqlException)
            {
                json = createMessageJSONStr(new Message {
                     isSuccess = false
                    , recordsAffected = -1
                    , errMsg = sqlException.ToString()
                });

            }
            finally
            {
                conn.Close(); 
            }
            return json;
        }
        public static string toJSON(SqlCommand cmd)
        {
            SqlDataReader rdr = null;
            SqlConnection conn = null;
            String connectionString = string.Empty;
            String json = "";
            try
            {
                conn = new SqlConnection(dbConnection.ConnectionString);
                cmd.Connection = conn;

                StringBuilder allJSONs = new StringBuilder();
                conn.Open();
                cmd.CommandTimeout = 3600;
                rdr = cmd.ExecuteReader();
                json = toJSON(rdr);
                rdr.Close();
            }
            catch (SqlException sqlException)
            { 
                json = "Connection Exception: " + sqlException.ToString() + "n";
            }
            finally
            {
                conn.Close();
            }
            return json;
        }

        public static Message processPostData( HttpRequestBase request) {
            request.InputStream.Seek(0, SeekOrigin.Begin);
            string jsonString = new StreamReader(request.InputStream).ReadToEnd();
            JObject json = JObject.Parse(jsonString);
            DataTable dt = JsonConvert.DeserializeObject<DataTable>(json["rows"].ToString());
            return dataTableUpdate(json["procedure"].ToString(), dt);
        }

        public static string GetJSONData(HttpRequestBase request)
        {
            try
            {
                request.InputStream.Seek(0, SeekOrigin.Begin);
                string jsonString = new StreamReader(request.InputStream).ReadToEnd();
                JObject json = JObject.Parse(jsonString);
                DataTable dt = JsonConvert.DeserializeObject<DataTable>(json["rows"].ToString());
                return getGetRecordsByDataTable(json["procedure"].ToString(), dt);
            }
            catch (Exception ex) {

                return createMessageJSONStr(new Message
                {
                     isSuccess = false
                    ,recordsAffected = -1
                    ,errMsg = ex.Message
                });
            }
        }
    }
}
