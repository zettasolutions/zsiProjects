using System.Web.Mvc;
using zsi.web.Models;

namespace zsi.web.Controllers
{
    public class SqlController : BaseController
    {
        #region "Private"
        private static string writeFiles(System.Collections.Generic.List<Models.fileModel> list, string subFolder, string Title)
        {

            foreach (Models.fileModel info in list)
            {
                AppSettings.WriteFile(subFolder + "\\", info.fileName + ".sql", info.content);
            }
            return list.Count + "  " + Title + " files created/affected.";
        }
        #endregion

        public ActionResult Index()
        {
            using (new impersonate())
            {
                if (this.isAuthorizedUser())
                    return View();
                else
                    return Redirect(Url.Content("~/"));
            }
        }

        public ContentResult Exec()
        {
            using (new impersonate())
            {

                return this.ToJSON(Request["p"], false);
            } 
        }

        public ContentResult Exec2()
        {
            using (new impersonate())
            {

                return this.ToJSON(Request["p"], false, JsonRowsFormat.Array);
            }
        }



        public ContentResult Proc()
        {
            using (new impersonate())
            {
                return this.ToJSON(Request["p"], true);
            }
        }

        public ContentResult Proc2()
        {
            using (new impersonate())
            {
                return this.ToJSON(Request["p"], true,JsonRowsFormat.Array);
            }
        }


        public ContentResult LogError()
        {
            using (new impersonate())
            {
                return this.ToJSON(Request["p"], true);
            }
        }

        public ContentResult CreateBackupDbOjects(string typeName)
        {
            using (new impersonate())
            {
                string r = "";
                r = CreateBackupDbSqlScripts(typeName);

                return Content(r);
            }
        }

        public static string CreateBackupDbSqlScripts(string typeName)
        {
            using (new impersonate())
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
        }
       
    }
}