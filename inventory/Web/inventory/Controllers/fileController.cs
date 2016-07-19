using System.IO;
using System.Web;
using System.Web.Mvc;
using zsiInventory.Models;
using System.Data.OleDb;
using System.Data;
using System.Data.SqlClient;
using System;
using System.Text;
using System.Collections.Generic;

namespace zsiInventory.Controllers
{


    public class fileController : baseController
    {
        public fileController() {
           this.dc = new dcAppProfile();
           this.app = dc.GetInfo();
        }

        #region "Private Methods"
        
            private string tempPath {get { return "c:\\temp\\"; }}
            private appProfile app { get; set; }
            private dcAppProfile dc { get; set; }

        #endregion

 
        public ActionResult viewImage(string fileName, string isThumbNail = "n")
        {

            var path = this.tempPath;
            var fullPath = path;
            if (Directory.Exists(app.image_folder)) path = app.image_folder;
            if (isThumbNail.ToLower() == "y") path = path + "thumbnails\\";
            fullPath = Path.Combine(path, fileName);
            if (!System.IO.File.Exists(fullPath))
                fullPath = "/images/no-image.jpg";

            return base.File(fullPath, "image/jpeg");
          
        }



        [HttpPost]
        public JsonResult UploadImage(HttpPostedFileBase file, string prefixKey)
        {

            try
            {
                var path = this.tempPath;
                var fullPath = path;
                var fileNameOrg = "";

                if (file != null && file.ContentLength > 0)
                {
                    if (Directory.Exists(app.image_folder)) path = app.image_folder;
                    fileNameOrg = Path.GetFileName(file.FileName);
                    fullPath = Path.Combine(path, prefixKey + fileNameOrg);
                    file.SaveAs(fullPath);

                }


            }
            catch (Exception ex)
            {

                return Json(new { isSuccess = false, errMsg = ex.Message });
            }

            return Json(new { isSuccess = true, msg = "ok" });
           

        }

        public FileResult loadFile(string fileName)
        {

            var path = this.tempPath;

            if (Directory.Exists(app.image_folder)) path = app.image_folder;
            var fullPath = Path.Combine(path, fileName);
            string contentType = MimeMapping.GetMimeMapping(fileName);
            return File(fullPath, contentType);
        }


        public FileResult loadTmpFile(string subDir, string fileName)
        {
            var _path = "";
            _path = this.app.network_group_folder + subDir;
            var fullPath = Path.Combine(_path, fileName);
            string contentType = MimeMapping.GetMimeMapping(fileName);
            return File(fullPath, contentType);
        }


        public ContentResult checkFile(string fileName)
        {

            var path = this.tempPath;
            if (Directory.Exists(app.image_folder)) path = app.image_folder;
            var fullPath = Path.Combine(path, fileName);

            return Content(System.IO.File.Exists(fullPath).ToString(),"text/plain",System.Text.Encoding.UTF8);

        }

        public ActionResult generateExcelFile(string sql, string fileName)
        {

            SqlConnection conn =  new SqlConnection(dbConnection.ConnectionString);
            SqlCommand cmd = new SqlCommand(sql, conn);
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

        public ActionResult generateHTMLToExcel(string sql, string fileName)
        {
 
            string html = "";
            SqlConnection conn = new SqlConnection(dbConnection.ConnectionString);
            SqlCommand cmd = new SqlCommand(sql, conn);
            conn.Open();
            SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (rdr.Read())
            {
                html += Convert.ToString(rdr[0]);
            }

            conn.Close();
            Response.Clear();
            Response.Charset = "";
            Response.ContentType = "application/msexcel";
            Response.AddHeader("Content-Disposition", "filename=" + fileName + ".xls");
            Response.Write(html);
            Response.End();
            Response.Flush();
            return RedirectToAction("/");
            

        }


        [HttpPost]
        public JsonResult deleteFiles(List<string> files)
        {

            try
            {

                var path = this.tempPath;
                if (Directory.Exists(app.image_folder)) path = app.image_folder;

                for(var x=0; x < files.Count; x++)
                {
                    string filename = path + files[x];
                    if (System.IO.File.Exists(filename)) {  
                        System.IO.File.Delete(filename);
                    }
                }
            }
            catch (Exception ex)
            {

                return Json(new { isSuccess = false, errMsg = ex.Message });
            }

            return Json(new { isSuccess = true, msg = "ok" });
          

        }



    }
}