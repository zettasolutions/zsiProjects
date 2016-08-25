namespace zsi.web.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class javascript
    {
        public int? js_id { get; set; }
        public string page_id { get; set; }
        public string js_content { get; set; }
        public int rev_no { get; set; }
    }
    public class javascript_v : javascript
    {
        public string page_name { get; set; }
        public string page_title { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public DateTime? created_date { get; set; }
        public DateTime? updated_date { get; set; }
    }
}
