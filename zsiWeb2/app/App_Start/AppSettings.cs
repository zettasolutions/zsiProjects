using System.Web;
using zsi.web.Models;
using System.Data;
using System;
using System.Data.SqlClient;
using System.Text;
using System.IO;
using Newtonsoft.Json;

namespace zsi.web
{
    public class AppSettings
    {
        public AppSettings() { }

        public static string BaseDirectory { get { return HttpContext.Current.Request.PhysicalApplicationPath; } }
        public static string dbWebSource { get { return AppSettings.BaseDirectory + "dbWebSource\\"; } }

        public static void WriteFile(string subFolderName, string fileName,string content) {
            if (!Directory.Exists(AppSettings.dbWebSource + subFolderName ))
                Directory.CreateDirectory(AppSettings.dbWebSource + subFolderName);
            System.IO.File.WriteAllText(AppSettings.dbWebSource + subFolderName + fileName, content);
        }
    }
}
