using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using zsi.DataAccess;
using zsi.DataAccess.Provider.SQLServer;
using System.Data.SqlClient;

namespace projectBM.Models
{
    public class dcAttributes :MasterDataController<attributes_v>
    {
        public override void InitDataController()
        {
            this.DBConn = new SqlConnection(dbConnection.ConnectionString);
            this.Procedures.Add(new Procedure("dbo.attributes_sel"), SQLCommandType.SingleRecord);
            this.Procedures.Add(new Procedure("dbo.attributes_sel"), SQLCommandType.Select);

        }

        public attributes_v GetInfo(string attribute_id)
        {

            this.SelectInfoParameters.Add("attribute_id", attribute_id);
            return this.GetInfo();
        }


    }

}