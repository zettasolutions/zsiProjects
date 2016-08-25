namespace zsi.web.Models
{
    using System;
    using System.Collections.Generic;
    
    public  class page
    {
        public int? page_id { get; set; }
        public string page_name { get; set; }
        public string page_title { get; set; }
        public int? master_page_id { get; set; }
    }

    public class page_v : page
    {
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public DateTime? created_date { get; set; }
        public DateTime? updated_date { get; set; }
    }
}
