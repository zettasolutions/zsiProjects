using System.Collections.Generic;
using System.Web.Mvc;
using zsi.web.Models;

namespace zsi.web.Controllers
{
    public class selectOptionController : baseController
    {


        [HttpPost, ValidateInput(false)]
        public JsonResult update(List<select_option> list)
        {

            DataHelper.dataTableUpdate("dbo.select_options_upd", CollectionHelper.toDataTable(list));

            return Json(new { msg = "ok" });
            


        }

        public ContentResult code(string param1,string param2="")
        {


            return this.toJSON("dbo.select_options_sel " + param1 + " " + param2,false);
         

        }

    }
}