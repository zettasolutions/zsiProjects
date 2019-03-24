using System.Web.Mvc;

namespace zsi.web.Controllers
{
    public class SqlController : BaseController
    {
        public ActionResult Index()
        {
            if ( this.isAuthorizedUser() )
                return View();
            else
                return Redirect(Url.Content("~/"));
        }

        public ContentResult Exec()
        {
               return this.ToJSON(Request["p"],false); 
        }

        public ContentResult Proc()
        {
                return this.ToJSON(Request["p"], true);
            
        }

        public ContentResult LogError()
        {
                return this.ToJSON(Request["p"],true);
            
        }

        public ContentResult CreateBackupDbOjects(string typeName)
        {
            string r = "";
           // using (new impersonate())
           // {
                r = CreateBackupDbSqlScripts(typeName);
          //  }
            return Content(r);
        }

        public static string CreateBackupDbSqlScripts(string typeName)
        {
            string r = "";
            var dbObj = new Models.dcDbObjects();
            switch (typeName)
            {
                case "tables":
                    r = writeFiles(dbObj.getTables(), typeName, "Tables");
                    break;
                case "procedures_functions":
                    r = writeFiles(dbObj.getProcedures(), typeName, "Procedures and Functions");
                    break;
                case "views":
                    r = writeFiles(dbObj.getViews(), typeName, "Views");
                    break;
                case "table_types":
                    r = writeFiles(dbObj.getTableTypes(), typeName, "Table Types");
                    break;

                default: break;

            }
            return r;
        }

        private static string writeFiles(System.Collections.Generic.List<Models.fileModel> list, string subFolder, string Title)
        {
            foreach (Models.fileModel info in list)
            {
                AppSettings.WriteFile(subFolder + "\\", info.fileName + ".sql", info.content);
            }
            return list.Count + "  " + Title + " files created/affected.";
        }
    }
}