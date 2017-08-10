using System.IO;
using System.Web;
using System.Web.Mvc;
using zsi.web.Models;
using System.Data;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO.Compression;

using System.Data.OleDb;

namespace zsi.web.Controllers
{
    public class fileController : baseController
    {

        public fileController()
        {
            this.tempPath = AppSettings.BaseDirectory + @"temp\";
            if (!Directory.Exists(tempPath)) Directory.CreateDirectory(tempPath);
        }

        #region "Private Methods"
        private string excelConnectionString;
        private string tempPath { get; set; }
 
        

        private void MigrateExcelFile(string fileName, string excel_column_range, string tempTable)
        {
            string virtualColumns = this.CurrentUser.userId + " as user_id";
            OleDbCommand command = default(OleDbCommand);
            OleDbDataReader rdr = default(OleDbDataReader);
            OleDbConnection conn = default(OleDbConnection);
            try
            {
                conn = new OleDbConnection(string.Format(excelConnectionString, fileName));
                conn.Open();
                if (virtualColumns != "") virtualColumns += ",";
                command = conn.CreateCommand();
                command.CommandText = string.Format("Select {0} * From [{1}]", virtualColumns, excel_column_range);
                command.CommandType = CommandType.Text;
                rdr = command.ExecuteReader();
                if (rdr.HasRows)
                {
                    SqlBulkCopy sqlBulk = new SqlBulkCopy(dbConnection.ConnectionString);
                    sqlBulk.DestinationTableName = tempTable;
                    sqlBulk.WriteToServer(rdr);
                    rdr.Close();
                }
                conn.Close();
            }
            catch (Exception ex)
            {
                if (conn.State == ConnectionState.Open) conn.Close();
                throw ex;
            };


        }

        #endregion

        [HttpPost]
        public JsonResult templateUpload(HttpPostedFileBase file, string tmpData)
        {
            string tmpTable = tmpData.Split(',')[0];
            string colRange = tmpData.Split(',')[1];
            try
            {
                excelConnectionString = this.AppConfig.excel_conn_str;
                var fullPath = tempPath;
                if (file != null && file.ContentLength > 0)
                {
                    this.AppConfig.excel_folder = this.AppConfig.excel_folder.Replace("~", AppSettings.BaseDirectory);
                    if (Directory.Exists(this.AppConfig.excel_folder)) tempPath = this.AppConfig.excel_folder;
                    var fileName = Path.GetFileName(file.FileName);
                    fullPath = Path.Combine(tempPath, fileName);
                    file.SaveAs(fullPath);
                    DataHelper.execute("temp_data_del @table_name='" + tmpTable + "',@user_id=" + this.CurrentUser.userId, false);
                    MigrateExcelFile(fullPath, colRange, tmpTable);
                    DataHelper.execute("temp_data_upd @table_name='" + tmpTable + "',@user_id=" + this.CurrentUser.userId, false);

                }
            }
            catch (Exception ex)
            {

                return Json(new { isSuccess = false, errMsg = ex.Message });
            }

            return Json(new { isSuccess = true, msg = "ok" });
        }
        public ActionResult viewImage(string fileName, string isThumbNail = "n")
        {

            var path = this.tempPath;
            var fullPath = path;
            if (Directory.Exists(this.AppConfig.image_folder)) path = this.AppConfig.image_folder;
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
                if (this.AppConfig.image_folder.Contains("~")) this.AppConfig.image_folder = this.AppConfig.image_folder.Replace("~", AppSettings.BaseDirectory);
                if (file != null && file.ContentLength > 0)
                {
                    if (Directory.Exists(this.AppConfig.image_folder)) path = this.AppConfig.image_folder;
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

            if (Directory.Exists(this.AppConfig.image_folder)) path = this.AppConfig.image_folder;
            var fullPath = Path.Combine(path, fileName);
            string contentType = MimeMapping.GetMimeMapping(fileName);
            return File(fullPath, contentType);
        }

        public FileResult loadTmpFile(string subDir, string fileName)
        {
            var _path = "";
            _path = this.AppConfig.network_group_folder + subDir;
            var fullPath = Path.Combine(_path, fileName);
            string contentType = MimeMapping.GetMimeMapping(fileName);
            return File(fullPath, contentType);
        }

        public ContentResult checkFile(string fileName)
        {

            var path = this.tempPath;
            if (Directory.Exists(this.AppConfig.image_folder)) path = this.AppConfig.image_folder;
            var fullPath = Path.Combine(path, fileName);

            return Content(System.IO.File.Exists(fullPath).ToString(), "text/plain", System.Text.Encoding.UTF8);

        }

        public ActionResult generateExcelFile(string sql, string fileName)
        {

            SqlConnection conn = new SqlConnection(dbConnection.ConnectionString);
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
        public JsonResult deleteFiles(List<string> files, string root = "")
        {
            try
            {
                var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                for (var x = 0; x < files.Count; x++)
                {
                    string filename = _dir + files[x];
                    if (System.IO.File.Exists(filename))
                    {
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

        [HttpPost]
        public JsonResult createFolders(string path, List<string> folders)
        {

            try
            {
                if (path != "") { if (!path.EndsWith(@"\")) path = path + @"\"; }
                for (int x = 0; x < folders.Count; x++)
                {
                    string _fullPath = this.AppConfig.network_group_folder + path + folders[x];
                    if (!Directory.Exists(_fullPath)) Directory.CreateDirectory(_fullPath);
                }

            }
            catch (Exception ex)
            {

                return Json(new { isSuccess = false, errMsg = ex.Message });
            }

            return Json(new { isSuccess = true, msg = "ok" });

        }

        public JsonResult getFolders(string path, string root = "")
        {
            IEnumerable<string> _folders;
            try
            {
                var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                _folders = Directory.GetDirectories(_dir + path).Select(f => Path.GetFileName(f));
            }
            catch (Exception ex)
            {
                return Json(new { isSuccess = false, errMsg = ex.Message });
            }
            return Json(new { isSuccess = true, folders = _folders });
        }

        public JsonResult getFiles(string path, string root = "", string searchPattern = "")
        {
            IEnumerable<string> _files;
            try
            {
                var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                if (searchPattern != "")
                    _files = Directory.GetFiles(_dir + path, searchPattern).Select(f => Path.GetFileName(f));
                else
                    _files = Directory.GetFiles(_dir + path).Select(f => Path.GetFileName(f));
            }
            catch (Exception ex)
            {
                return Json(new { isSuccess = false, errMsg = ex.Message });
            }
            return Json(new { isSuccess = true, files = _files });
        }

        public ContentResult readFile(string fileName, string root = "")
        {
            string _content = "";
            try
            {
                var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                using (StreamReader sr = new StreamReader(_dir + fileName))
                {
                    _content = sr.ReadToEnd();
                }
            }
            catch (Exception ex)
            {
                return Content("error:" + ex.Message);
            }
            return Content(_content);
        }

        [HttpPost]
        public JsonResult saveFile(string fileName, string content, string root = "")
        {
            try
            {
                var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                using (StreamWriter sw = new StreamWriter(_dir + fileName))
                {
                    sw.WriteLine(HttpUtility.HtmlDecode(content));
                }
            }
            catch (Exception ex)
            {
                return Json(new { isSuccess = false, errMsg = ex.Message });
            }
            return Json(new { isSuccess = true, msg = "File has been saved." });
        }

        public FileResult downLoadFile(string fileName, string root = "")
        {
            var _dir = (root == "" ? AppSettings.BaseDirectory : root);
            byte[] fileBytes = System.IO.File.ReadAllBytes(_dir + fileName);
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }

        public JsonResult deleteFile(string fileName, string root = "")
        {
            try
            {
                var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                string filename = _dir + fileName;
                if (System.IO.File.Exists(filename))
                {
                    System.IO.File.Delete(filename);
                }
            }
            catch (Exception ex)
            {

                return Json(new { isSuccess = false, errMsg = ex.Message });
            }

            return Json(new { isSuccess = true, msg = "ok" });
        }

        public JsonResult extractFile(string fileName, string root = "")
        {
            try
            {
                var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                string filename = _dir + fileName;
                System.IO.FileInfo _fileInfo = new FileInfo(filename);
                string filedirectory = _fileInfo.Directory.FullName;
                ZipFile.ExtractToDirectory(filename, filedirectory);
            }
            catch (Exception ex)
            {
                return Json(new { isSuccess = false, errMsg = ex.Message });
            }
            return Json(new { isSuccess = true, msg = "ok" });
        }

        [HttpPost]
        public JsonResult UploadFile(HttpPostedFileBase file, string root = "")
        {
            try
            {
                if (file != null && file.ContentLength > 0)
                {
                    var _dir = (root == "" ? AppSettings.BaseDirectory : (!root.Contains(":") ? AppSettings.BaseDirectory + root : root));
                    var fileName = Path.GetFileName(file.FileName);
                    var fullPath = _dir + fileName;
                    file.SaveAs(fullPath);
                }
            }
            catch (Exception ex)
            {
                return Json(new { isSuccess = false, errMsg = ex.Message });
            }
            return Json(new { isSuccess = true, msg = "ok" });
        }

        public JsonResult getImageFileNames(string subDir, string searchPattern)
        {
            List<string> _fileNames = new List<string>();
            try
            {
                string[] _files;

                if (searchPattern != null)
                    _files = Directory.GetFiles(this.AppConfig.image_folder + subDir, searchPattern);
                else
                    _files = Directory.GetFiles(this.AppConfig.image_folder + subDir);

                foreach (var f in _files)
                {

                    _fileNames.Add(Path.GetFileName(f));
                }

            }
            catch (Exception ex)
            {

                return Json(new { isSuccess = false, errMsg = ex.Message });
            }

            return Json(new { isSuccess = true, files = _fileNames.ToArray() });
        }

    }
}