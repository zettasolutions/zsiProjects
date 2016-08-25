using zsi.DataAccess;
using zsi.DataAccess.Provider.SQLServer;
using System.Data.SqlClient;

namespace zsi.web.Models
{
    public class dcPage :MasterDataController<page_v>
    {
        public override void InitDataController()
        {
            this.DBConn = new SqlConnection(dbConnection.ConnectionString);
            this.Procedures.Add(new Procedure("dbo.pages_sel"), SQLCommandType.SingleRecord);
            this.Procedures.Add(new Procedure("dbo.pages_sel"), SQLCommandType.Select);
            this.Procedures.Add(new Procedure("dbo.pages_upd"), SQLCommandType.Update);
        }

        public page_v GetPageByName(string page_name)
        {
            this.SelectInfoParameters.Add("page_name", page_name);
            return this.GetInfo();
        }
    }
}