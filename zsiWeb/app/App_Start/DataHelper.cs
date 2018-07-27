using System.Web;
using zsi.web.Models;
using System.Data;
using System;
using System.Data.SqlClient;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace zsi.web
{
    public class DataHelper
    {
        public DataHelper() { }
        #region "private static"
        private static string ToJSON(SqlDataReader rdr)
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
        private static string CreateMessageJSONStr(Message message )
        {
            return "{\"isSuccess\":" + message.isSuccess.ToString().ToLower()
                + ",\"recordsAffected\":" + message.recordsAffected
                + ",\"returnValue\":" + message.returnValue
                +",\"rows\":" + message.rows
                + ",\"errMsg\":\"" + message.errMsg + "\"}";
        }
        private static void SerializeURLParameters(SqlCommand command, string sqlQuery)
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
        private static Message _DataTableUpdate(string procedureName, DataTable dt, string parentId)
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
                    cmd.Parameters.AddWithValue("@user_id", SessionHandler.CurrentUser.userId);
                    if (parentId != "") cmd.Parameters.AddWithValue("@parent_id", parentId);
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
                m.errNumber = ex.ErrorCode;
                m.errMsg = ex.Message;
                LogError(ex.ErrorCode, procedureName + ",params:" + DataTableToJSON(dt), ex.Message, "E");
            }
            catch (Exception ex)
            {
                m.errMsg = ex.Message;
                LogError(null, procedureName + ",params:" + DataTableToJSON(dt), ex.Message, "E");
            }
            return m;

        }
        private static JObject HttpReqStreamToJObject(HttpRequestBase req) {
            req.InputStream.Seek(0, SeekOrigin.Begin);
            return JObject.Parse(new StreamReader(req.InputStream).ReadToEnd());
        }
        #endregion

        public static DataTable GetDataTable(string sql)
        {
            SqlConnection conn = new SqlConnection(dbConnection.ConnectionString);
            SqlCommand cmd = new SqlCommand(sql, conn);
            conn.Open();
            var dr = cmd.ExecuteReader();
            var dt = new DataTable();
            dt.Load(dr);
            conn.Close();
            dt.Dispose();
            dr.Dispose();
            return dt;
        }
        public static Message DataTableUpdate(string procedureName, DataTable dt, string parentId)
        {
            return _DataTableUpdate(procedureName, dt, parentId);

        }
        public static Message DataTableUpdate(string procedureName, DataTable dt)
        {
            return _DataTableUpdate(procedureName, dt, "");
        }
        public static string DataTableToJSON(DataTable table)
        {
            string JSONString = string.Empty;
            JSONString =  JsonConvert.SerializeObject(table);
            return JSONString;
        }
        public static void LogError(int? errNumber, string procedure, string errMessage, string type) {

            SqlConnection conn = new SqlConnection(dbConnection.ConnectionString);
            using (conn)
            {
                SqlCommand cmd = new SqlCommand("dbo.error_logs_upd", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                if (errNumber != null) cmd.Parameters.AddWithValue("@error_no", errNumber);
                cmd.Parameters.AddWithValue("@page_url", "db:" + procedure);
                cmd.Parameters.AddWithValue("@error_msg", errMessage);
                cmd.Parameters.AddWithValue("@error_type", type);
                cmd.Parameters.AddWithValue("@user_id", SessionHandler.CurrentUser.userId);
                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
            }
            conn.Dispose();

        }
        public static string GetDbValue(string sql) {
            SqlConnection conn = new SqlConnection(dbConnection.ConnectionString);
            SqlCommand cmd = new SqlCommand(sql, conn);
            string returnValue = "";
            cmd.CommandType = CommandType.Text;
            conn.Open();
            returnValue = Convert.ToString(cmd.ExecuteScalar());
            conn.Close();
            return returnValue;
        }
        public static string GetGetRecordsByJsonObject(JObject json)
        {

            String _json = "";
            SqlDataReader rdr = null;
            SqlConnection conn = null;
            try
            {
                conn = new SqlConnection(dbConnection.ConnectionString);
                using (conn)
                {

                    if (json["sqlCode"] == null)
                        throw new Exception("sql code is required.");
                    string sqlCode = json["sqlCode"].ToString();
                    SqlCommands sc = new dcSQLCommands().GetInfo(sqlCode);

                    if (sc.isPublic == true && SessionHandler.CurrentUser.userId == 0) {
                        throw new Exception("db permission is required.");
                    }

                    SqlCommand cmd = new SqlCommand(sc.text, conn);
                    if (sc.IsProcedure)
                        cmd.CommandType = CommandType.StoredProcedure;
                    else
                        cmd.CommandType = CommandType.Text;

                    if (json["rows"] != null)
                    {
                        DataTable dt = new DataTable();
                        string _jRowStr = "";
                        _jRowStr = json["rows"].ToString();

                        if (_jRowStr == "" || _jRowStr.ToCharArray()[0] != '[')
                            throw new Exception("rows parameter must be array.");
                        dt = JsonConvert.DeserializeObject<DataTable>(_jRowStr);
                        if (dt.Rows.Count > 0)
                        {
                            SqlParameter tvparam = cmd.Parameters.AddWithValue("@tt", dt);
                            tvparam.SqlDbType = SqlDbType.Structured;
                        }
                    }
                    if (json["parameters"] != null)
                    {
                        JObject obj = (JObject)json["parameters"];
                        foreach (var pair in obj)
                        {
                            if (pair.Value.ToString() == "''") continue;
                            cmd.Parameters.AddWithValue("@" + pair.Key, pair.Value.ToString());
                        }
                    }
                    cmd.Parameters.AddWithValue("@user_id", SessionHandler.CurrentUser.userId);
                    conn.Open();
                    cmd.CommandTimeout = 3600;
                    SqlParameter retval = new SqlParameter();
                    retval.ParameterName = "@return_value";
                    retval.SqlDbType = SqlDbType.Int;
                    retval.Direction = ParameterDirection.ReturnValue;
                    cmd.Parameters.Add(retval);

                    rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                    _json = ToJSON(rdr);
                    rdr.Close();

                    _json = CreateMessageJSONStr(new Message
                    {
                        isSuccess = true,
                        recordsAffected = rdr.RecordsAffected,
                        rows = _json,
                        returnValue = Convert.ToString(retval.Value)
                    });

                }
            }
            catch (SqlException sqlException)
            {
                _json = CreateMessageJSONStr(new Message
                {
                    isSuccess = false,
                    recordsAffected = -1,
                    errMsg = sqlException.ToString()
                });

            }
            finally
            {
                conn.Close();
            }
            return _json;

        }
        public static void Execute(string sql, bool isProcedure) {
            ToJSON(sql, isProcedure);
        }
        public static string ToJSON(string sql, bool isProcedure)
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
                    SerializeURLParameters(command, sql);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@user_id", SessionHandler.CurrentUser.userId);
                }
                conn.Open();
                command.CommandTimeout = 3600;
                SqlParameter retval = new SqlParameter();
                retval.ParameterName = "@return_value";
                retval.SqlDbType = SqlDbType.Int;
                retval.Direction = ParameterDirection.ReturnValue;
                command.Parameters.Add(retval);
               
                rdr = command.ExecuteReader(CommandBehavior.CloseConnection);
                json = ToJSON(rdr);
                rdr.Close();

                if (json == "[]" && rdr.RecordsAffected > 0)
                    json = CreateMessageJSONStr(new Message {
                        isSuccess = true
                        , recordsAffected = rdr.RecordsAffected
                        , rows = "[]"
                    });
                else
                    json = CreateMessageJSONStr(new Message {
                        isSuccess = true
                        , recordsAffected = rdr.RecordsAffected
                        , rows = json
                        , returnValue = Convert.ToString(retval.Value)
                    });
                
            }
            catch (SqlException sqlException)
            {
                json = CreateMessageJSONStr(new Message {
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
        public static string ToJSON(SqlCommand cmd)
        {
            SqlDataReader rdr = null;
            SqlConnection conn = null;
            String connectionString = string.Empty;
            String json = "";
            try
            {
                conn = new SqlConnection(dbConnection.ConnectionString);
                cmd.Connection = conn;
                conn.Open();
                cmd.CommandTimeout = 3600;
                rdr = cmd.ExecuteReader();
                json = ToJSON(rdr);
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
        public static Message ProcessPostData( HttpRequestBase request) {
            JObject json = HttpReqStreamToJObject(request);
           DataTable dt = JsonConvert.DeserializeObject<DataTable>(json["rows"].ToString());
            string parentId = (json["parentId"] ==null ? "" :  json["parentId"].ToString());
            return DataTableUpdate(json["procedure"].ToString(), dt, parentId);
        }
        public static string GetJSONData(HttpRequestBase request)
        {
            try
            {
                JObject json = HttpReqStreamToJObject(request);
                return GetGetRecordsByJsonObject(json);
            }
            catch (Exception ex) {

                return CreateMessageJSONStr(new Message
                {
                     isSuccess = false
                    ,recordsAffected = -1
                    ,errMsg = ex.Message
                });
            }
        }
    }
}
