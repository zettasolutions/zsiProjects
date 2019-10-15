using System;
using System.Web.Mvc;
using System.Data;
using System.Data.SqlClient;
using ClosedXML.Excel;
using System.IO;
using System.Xml;
using zsi.web.Models;
namespace zsi.web.Controllers
{
    public class ExcelController : BaseController
    {
        private appProfile app { get; set; }
        private dcAppProfile dc { get; set; }
        public ExcelController()
        {
            this.dc = new dcAppProfile();
            this.app = dc.GetInfo();
        }
        private string getColumnName(int columnNumber)
        {
            int dividend = columnNumber;
            string columnName = String.Empty;
            int modulo;

            while (dividend > 0)
            {
                modulo = (dividend - 1) % 26;
                columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
                dividend = (int)((dividend - modulo) / 26);
            }

            return columnName;
        }

        private int[] getNewZeroValues()
        {
            return new int[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
        }

        public ActionResult ExecuteSQL(string sql, string fileName)
        {
            using (new impersonate())
            {
                SqlConnection conn = new SqlConnection(dbConnection.ConnectionString);
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.CommandTimeout = 0;
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                DataTable dt = new DataTable();
                dt.Load(rdr);
                conn.Close();
                Response.ClearContent();
                Response.AddHeader("content-disposition", "attachment; filename=" + fileName + ".xls");
                Response.ContentType = "application/vnd.ms-excel";
                string tab = "";
                foreach (DataColumn dc in dt.Columns)
                {
                    Response.Write(tab + dc.ColumnName);
                    tab = "\t";
                }
                Response.Write("\n");
                int i;
                foreach (DataRow dr in dt.Rows)
                {
                    tab = "";
                    for (i = 0; i < dt.Columns.Count; i++)
                    {
                        Response.Write(tab + dr[i].ToString());
                        tab = "\t";
                    }
                    Response.Write("\n");
                }
                Response.End();

                return RedirectToAction("/");
            }

        }

        public ActionResult ExecuteSQLHTMLToExcel(string sql, string fileName)
        {
            using (new impersonate())
            {
                string html = "";
                SqlConnection conn = new SqlConnection(dbConnection.ConnectionString);
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.CommandTimeout = 0;
                conn.Open();
                SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                while (rdr.Read())
                {
                    html += Convert.ToString(rdr[0]);
                }

                return HtmlToExcel(html, fileName);
            }

        }


        [HttpPost]
        [ValidateInput(false)]
        public ActionResult HtmlToExcel(string html, string fileName)
        {
            Response.Clear();
            Response.Charset = "";
            Response.ContentType = "application/msexcel";
            Response.AddHeader("Content-Disposition", "filename=" + fileName + ".xls");
            Response.Write(Uri.UnescapeDataString(html));
            Response.End();
            Response.Flush();
            return RedirectToAction("/");
        }


        [HttpPost]
        [ValidateInput(false)]
        public FileResult HtmlToExcel2(string html, string fileName, string sheetName = "")
        {
            var dt = HtmlToDataTable(Uri.UnescapeDataString(html));
            var wb = new XLWorkbook();
            FillDataTableToWorkSheets(dt, wb.Worksheets, (sheetName != "" ? sheetName : "download"));
            MemoryStream stream = new MemoryStream();
            wb.SaveAs(stream);
            return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName + ".xlsx");
        }

        private DataTable HtmlToDataTable(string html)
        {

            DataTable dt = new DataTable();
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(System.Net.WebUtility.UrlDecode(html));
            var x = 0;
            DataRow row = null;
            var y = 0;
            var cellName = "";
            XmlNodeList ths = xmlDoc.SelectNodes("table/thead/tr/th");
            XmlNodeList tds = xmlDoc.SelectNodes("table/tbody/tr");
            XmlNodeList tfs = xmlDoc.SelectNodes("table/tfoot/tr");
            XmlNodeList trs = null;

            if (ths.Count == 0) ths = xmlDoc.SelectNodes("table/tr/th");
            if (tds.Count == 0) tds = xmlDoc.SelectNodes("table/tr");

            for (x = 0; x < ths.Count; x++)
            {
                var cell = ths[x];
                dt.Columns.Add(cell.InnerText);
            }
            trs = tds;
            insertDataRows:
            if (trs.Count > 0)
            {
                for (y = 0; y < trs.Count; y++)
                {
                    var cells = trs[y].ChildNodes;
                    row = dt.NewRow();
                    for (x = 0; x < cells.Count; x++)
                    {
                        var cell = cells[x];
                        string[] cellNames = { "th", "td" };
                        cellName = cell.LocalName.ToString();

                        if (cellName == "th")
                        {
                            if (!dt.Columns.Contains(cell.InnerText)) dt.Columns.Add(cell.InnerText);
                        }
                        if (cellName == "td") row[x] = cell.InnerText;
                    }
                    if (cellName == "td")
                    {
                        dt.Rows.Add(row);
                        cellName = "";
                    }
                }
                if (tfs != null)
                {
                    trs = tfs;
                    tfs = null;
                    goto insertDataRows;
                }
            }
            return dt;
        }

        [ValidateInput(false)]
        public FileResult ExecuteMultipleSQL(string parameters, string filename)
        {
            var wb = new XLWorkbook();
            var _arr = parameters.Split(new string[] { "|;|" }, StringSplitOptions.None);
            foreach (string param in _arr)
            {
                AddWorkSheet(wb.Worksheets, param);
            }
            MemoryStream stream = new MemoryStream();
            wb.SaveAs(stream);

            return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", filename + ".xlsx");
        }

        private void AddWorkSheet(IXLWorksheets worksheets, string param)
        {
            string[] _arr = param.Split(new string[] { "||" }, StringSplitOptions.None);
            string _text = _arr[0];
            DataTable dt;
            if (!_text.ToLower().Contains("<table"))
                dt = DataHelper.GetDataTable(_text);
            else
                dt = HtmlToDataTable(System.Net.WebUtility.UrlDecode(_text));

            FillDataTableToWorkSheets(dt, worksheets, _arr[1]);
        }

        private void FillDataTableToWorkSheets(DataTable dt, IXLWorksheets worksheets, string sheetName)
        {
            var ws = worksheets.Add(sheetName);
            var cols = dt.Columns;
            var rows = dt.Rows;
            var lineNo = 1;
            //header
            for (var x = 0; x < cols.Count; x++)
            {
                ws.Cell(lineNo, x + 1).Value = cols[x].ColumnName;

            }
            //rows
            for (var y = 0; y < rows.Count; y++)
            {
                for (var x = 0; x < cols.Count; x++)
                {
                    ws.Cell(y + lineNo + 1, x + 1).Value = rows[y][x];
                }
            }
        }

    }

}