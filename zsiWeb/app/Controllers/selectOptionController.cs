using System.Collections.Generic;
using System.Web.Mvc;
using zsi.web.Models;

namespace zsi.web.Controllers
{
    public class SelectOptionController : BaseController
    {
        public ContentResult Code(string param1,string param2="")
        {
            return this.ToJSON("dbo.select_options_sel " + param1 + " " + param2,false);
        }

    }
}