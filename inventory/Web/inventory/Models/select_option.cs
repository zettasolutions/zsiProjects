namespace zsiInventory.Models
{
    using System;
    using System.Collections.Generic;
    using System.Data.SqlClient;

    public class option
    {
        public string text { get; set; }
        public string value { get; set; }
    }

    public class select_option : option
    {
        public int? select_id { get; set; }
        public string code { get; set; }
        public string table_name { get; set; }
        public string condition_text { get; set; }
        public string order_by { get; set; }
    }
   
}



	
