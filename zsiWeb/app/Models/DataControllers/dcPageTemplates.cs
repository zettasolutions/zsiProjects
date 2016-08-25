using System.Collections.Generic;
using zsi.DataAccess;
using zsi.DataAccess.Provider.SQLServer;
using System.Data.SqlClient;

namespace zsi.web.Models
{
    public class dcPageTemplate :MasterDataController<page_template_v>
    {
        public override void InitDataController()
        {
            this.DBConn = new SqlConnection(dbConnection.ConnectionString);
            string spSelect = "dbo.page_templates_sel";
            this.Procedures.Add(new Procedure(spSelect), SQLCommandType.SingleRecord);
            this.Procedures.Add(new Procedure(spSelect), SQLCommandType.Select);
            this.Procedures.Add(new Procedure("dbo.page_templates_upd"), SQLCommandType.Update);
        }


        public List<page_template_v> CreateBackup(bool selfBackup)
        {
            if (selfBackup) this.SelectParameters.Add("self_backup", 1);
            return this.GetDataSource();
        }

        public page_template_v GetInfo(string pageName)
        {             
            this.SelectInfoParameters.Add("page_name", pageName);
            this.SelectInfoParameters.Add("user_id",SessionHandler.CurrentUser.userId);
            return this.GetInfo();
        }
    }
}