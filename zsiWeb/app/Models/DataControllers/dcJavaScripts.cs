using System.Collections.Generic;
using zsi.DataAccess;
using zsi.DataAccess.Provider.SQLServer;
using System.Data.SqlClient;

namespace zsi.web.Models
{
    public class dcJavaScript : MasterDataController<javascript_v>
    {
        public override void InitDataController()
        {
            this.DBConn = new SqlConnection(dbConnection.ConnectionString);
            string spSelect = "dbo.javascripts_sel";
            this.Procedures.Add(new Procedure(spSelect), SQLCommandType.SingleRecord);
            this.Procedures.Add(new Procedure(spSelect), SQLCommandType.Select);
            this.Procedures.Add(new Procedure("dbo.javascripts_upd"), SQLCommandType.Update);

        }

        public List<javascript_v> CreateBackup(bool selfBackup) {
            this.SelectParameters.Add("user_id", SessionHandler.CurrentUser.userId );
            this.SelectParameters.Add("self_backup", selfBackup == true ? 1 : 0);
            return this.GetDataSource();
        }


        public javascript_v GetInfo(string pageName)
        {
            this.SelectInfoParameters.Add("page_name", pageName);
            this.SelectInfoParameters.Add("user_id", SessionHandler.CurrentUser.userId);
            return this.GetInfo();
        }
    }
}