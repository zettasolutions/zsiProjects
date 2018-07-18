using zsi.DataAccess;
using zsi.DataAccess.Provider.SQLServer;
using System.Data.SqlClient;

namespace zsi.web.Models
{
    public class PageData:page_template_v
    {
        public int page_js_rev_no { get; set; }
        public int zsi_lib_rev_no { get; set; }
        public int app_start_js_rev_no { get; set; }
        public string master_page_name { get; set; }
        public string role { get; set; }
    }
    public class dcPageData : MasterDataController<PageData>
    {
        public override void InitDataController()
        {
            this.DBConn = new SqlConnection(dbConnection.ConnectionString);
            this.Procedures.Add(new Procedure("dbo.page_data_sel"), SQLCommandType.SingleRecord);

        }
        public PageData GetData(string pageName,int userId,string isPublic = "N") {
            if (pageName !=null)
            {
                this.SelectInfoParameters.Add("page_name", pageName);
                this.SelectInfoParameters.Add("user_id",   userId);
                this.SelectInfoParameters.Add("is_public", isPublic);

                return this.GetInfo();
            }
            else
                return new PageData();
        }
    }
}
