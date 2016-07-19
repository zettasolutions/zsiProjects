namespace zsiInventory.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class user
    {
        public int user_id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string role { get; set; }
        public string last_name { get; set; }
        public string first_name { get; set; }
        public string middle_ini { get; set; }
        public string domain { get { return "corplear"; } }

    }
}
