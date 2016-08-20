namespace createCodeBackup
{
    using System.IO;
    using System.Windows.Forms;
    using System.Xml;
    public class settings
    {

        public static string BaseDirectory { get { return Application.StartupPath + "\\"; } }
        public static string dbWebSource { get { return BaseDirectory + "dbWebSource\\"; } }


        public static string dbConnectionString
        {
            get
            {
                XmlDocument xSettings = new XmlDocument();
                xSettings.Load(new System.IO.StreamReader(BaseDirectory + "web.config"));
                return xSettings["configuration"]["connectionStrings"].ChildNodes[0].Attributes["connectionString"].Value;
            }
        }


        public static void WriteFile(string subFolderName, string fileName, string content)
        {
            if (!Directory.Exists(dbWebSource + subFolderName))
                Directory.CreateDirectory(dbWebSource + subFolderName);

            File.WriteAllText(dbWebSource + subFolderName + fileName, content);
        }


    }

}

