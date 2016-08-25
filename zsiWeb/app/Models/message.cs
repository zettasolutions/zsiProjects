namespace zsi.web.Models
{
    public  class Message
    {   
        public bool isSuccess {get;set;}    
        public int recordsAffected { get; set; }
        public string returnValue { get; set; }
        public string rows { get; set; }
        public int currentPageNo { get; set; }
        public int errNumber{ get; set; }
        public string errMsg { get; set; }
        public string errType{ get; set; }
    }

}
