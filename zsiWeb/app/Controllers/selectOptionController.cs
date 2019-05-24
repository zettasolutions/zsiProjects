using System;
using System.Web.Mvc;
using zsi.web.Models;

namespace zsi.web.Controllers
{
    public class SelectOptionController : BaseController
    {
        public ContentResult Code(string param1,string param2="")
        {
            try
            {
                using (new impersonate())
                {
                    return this.ToJSON("dbo.select_options_sel " + param1 + " " + param2, false);
                }
            }
            catch (Exception ex)
            {
                return Content("{errMsg:'" + ex.Message + "'}", "application/json");
            }

        }

    }
}