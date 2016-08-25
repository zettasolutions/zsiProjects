namespace zsi.web.Models
{
    using zsi.DataAccess;
    using zsi.DataAccess.Provider.SQLServer;
    using System.Data.SqlClient;

    public class appProfile
    {   
        public string app_title {get;set;}    
        public string date_format { get; set; }
        public string bg_img_path_name { get; set; }
        public string excel_folder { get; set; }
        public string image_folder { get; set; }
        public string default_page { get; set; }
        public string excel_conn_str { get; set; }
        public string network_group_folder { get; set; }

    }

    public class dcAppProfile : MasterDataController<appProfile>
    {
        public override void InitDataController()
        {
            this.DBConn = new SqlConnection(dbConnection.ConnectionString);
            this.Procedures.Add(new Procedure("dbo.app_profile_sel"), SQLCommandType.SingleRecord);
        }
    }

}
