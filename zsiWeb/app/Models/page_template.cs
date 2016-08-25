namespace zsi.web.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class page_template
    {
        public int? pt_id { get; set; }
        public int page_id { get; set; }
        public string pt_content { get; set; }
    }
    public partial class page_template_v:page_template
    {
        public string page_name{ get; set; }
        public string page_title { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public DateTime? created_date { get; set; }
        public DateTime? updated_date { get; set; }
    }
}
