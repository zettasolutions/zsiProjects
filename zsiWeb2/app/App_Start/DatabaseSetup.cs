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
    public class DataBaseSetup
    {
        public DataBaseSetup() { }
        
        
        public static void restorBackup(string dbName)
        {
            string[] keyValues = dbConnection.ConnectionString.Split(';');
            string newConnections = "";
            for (int x = 0; x < keyValues.Length; x++)
            {
                string pair = keyValues[x].ToLower();
                if ( ! (pair.Contains("initial catalog") || pair.Contains("database"))  && pair != "")
                    newConnections += keyValues[x] + ";";
            }
            newConnections += "initial catalog=master";
            SqlConnection conn = new SqlConnection(newConnections);
            var backupFileName = AppSettings.BaseDirectory + @"temp\smagerUpDb.bak";

            string scripts = "declare @path as varchar(max) "
                             + "select @path = replace(physical_name, 'master.mdf', '') from sys.database_files where type = 0 "
                             + " declare @file1 as varchar(max) = @path + '{0}.mdf' "
                             + " declare @file2 as varchar(max) = @path + '{0}_log.ldf' "
                             + " RESTORE DATABASE {0} "
                             + " FROM  DISK = '{1}' "
                             + " WITH FILE = 1 "
                             + "    ,MOVE N'smagerUpDb' TO @file1 "
                             + "    ,MOVE N'smagerUpDb_log' TO @file2 "
                             + "    ,NOUNLOAD, REPLACE, STATS = 10 ";

            string sql = string.Format(scripts, dbName, backupFileName);
            SqlCommand cmd = new SqlCommand(sql, conn);
            cmd.CommandType = CommandType.Text;
            conn.Open();
            cmd.ExecuteReader();
            conn.Close();        

        }

 
    }
}
