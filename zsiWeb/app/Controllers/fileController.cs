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
    public class FileController : BaseController
    {

        public FileController()
        {
            using (new impersonate())
            {
                this.tempPath = AppSettings.BaseDirectory + @"temp\";
                if (!Directory.Exists(tempPath)) Directory.CreateDirectory(tempPath);
            }
        }

        #region "Private Methods"
        private bool ByteArrayToFile(string fileName, byte[] byteArray)
        {
            try
            {
                using (var fs = new FileStream(fileName, FileMode.Create, FileAccess.Write))
                {
                    fs.Write(byteArray, 0, byteArray.Length);
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception caught in process: {0}", ex);
                return false;
            }
        }
        private string excelConnectionString;
        private string tempPath { get; set; }
        private void MigrateExcelFile(string fileName, string excel_column_range, string tempTable, string extraColumns)
        {
            string virtualColumns = this.CurrentUser.userId + " as user_id" + extraColumns;
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
        private void createProjectZipFile(string zipFileName, string[] folders)
        {

            if (System.IO.File.Exists(zipFileName)) System.IO.File.Delete(zipFileName);
            ZipArchive zip = ZipFile.Open(zipFileName, ZipArchiveMode.Create);
            foreach (string folder in folders)
            {
                var _folders = folder.Split('\\');
                var _folderName = _folders[_folders.Count() - 1];

                var _files = Directory.GetFiles(folder, "*.*");
                foreach (string file in _files)
                {
                    zip.CreateEntryFromFile(file, _folderName + @"\" + Path.GetFileName(file), CompressionLevel.Optimal);

                }
            }
            zip.Dispose();
     
        }
        private void updateWebCodes(string zipPath)
        {
            //zipPath = @"C:\temp\webcodes\gfuentes-app-codes.zip";

            using (ZipArchive archive = ZipFile.OpenRead(zipPath))
            {
                foreach (ZipArchiveEntry entry in archive.Entries)
                {
                    Stream _stream = entry.Open();
                    StreamReader reader = new StreamReader(_stream);
                    var _content = reader.ReadToEnd();
                    var _ext = Path.GetExtension(entry.FullName);
                    var _fileName = Path.GetFileNameWithoutExtension(entry.FullName);
                    if (_content.Trim().Length == 0) continue;
                    switch (_ext)
                    {
                        case ".js":
                            dcJavaScript dcs = new dcJavaScript();
                            zsi.DataAccess.Provider.SQLServer.SProcParameters ps = dcs.UpdateParameters;
                            ps.Add("js_name", _fileName);
                            ps.Add("js_content", _content);
                            ps.Add("user_id", CurrentUser.userId);
                            dcs.Execute(zsi.DataAccess.SQLCommandType.Update);
                            break;
                        case ".html":
                            dcPageTemplate dct = new dcPageTemplate();
                            zsi.DataAccess.Provider.SQLServer.SProcParameters pt = dct.UpdateParameters;
                            pt.Add("pt_name", _fileName);
                            pt.Add("pt_content", _content);
                            pt.Add("user_id", CurrentUser.userId);
                            dct.Execute(zsi.DataAccess.SQLCommandType.Update);
                            break;

                        default: break;
                    }

                }
            }

        }
        #endregion

        [HttpPost]
        public JsonResult templateUpload(HttpPostedFileBase file, string tmpData)
        {
            string[] arrParams = tmpData.Split(',');
            string tmpTable = arrParams[0];
            string colRange = arrParams[1];
            string extraColumns = (arrParams.Length == 3 ? "," + arrParams[2]:"");
            try
            {
                using (new impersonate())
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
                        DataHelper.Execute("temp_data_del @table_name='" + tmpTable + "',@user_id=" + this.CurrentUser.userId, false);
                        MigrateExcelFile(fullPath, colRange, tmpTable, extraColumns);
                        DataHelper.Execute("temp_data_upd @table_name='" + tmpTable + "',@user_id=" + this.CurrentUser.userId, false);

                    }
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
            try
            {
                using (new impersonate())
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
            }
            catch {
                return base.File("/images/no-image.jpg", "image/jpeg");
            }

        }

        [HttpPost]
        public JsonResult UploadImage(HttpPostedFileBase file, string prefixKey)
        {

            try
            {
                using (new impersonate())
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

            }
            catch (Exception ex)
            {

                return Json(new { isSuccess = false, errMsg = ex.Message });
            }

            return Json(new { isSuccess = true, msg = "ok" });


        }

        [HttpPost]
        public JsonResult UploadImages( IEnumerable<HttpPostedFileBase> files, string prefixKey)
        {

            try
            {
                using (new impersonate())
                {
                    var path = this.tempPath;
                    var fullPath = path;
                    var fileNameOrg = "";
                    if (this.AppConfig.image_folder.Contains("~")) this.AppConfig.image_folder = this.AppConfig.image_folder.Replace("~", AppSettings.BaseDirectory);
                    foreach (var file in files)
                    {
                        if (file != null && file.ContentLength > 0)
                        {
                            if (Directory.Exists(this.AppConfig.image_folder)) path = this.AppConfig.image_folder;
                            fileNameOrg = Path.GetFileName(file.FileName);
                            fullPath = Path.Combine(path, prefixKey + fileNameOrg);
                            file.SaveAs(fullPath);

                        }
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
        public JsonResult UploadImageDb(HttpPostedFileBase file, int? image_id,string sqlCode)
        {

            try
            {
                using (new impersonate())
                {

                    var path = AppSettings.BaseDirectory + @"images\dbimages\";
                    if (!Directory.Exists(path)) Directory.CreateDirectory(path);

                    var content = new byte[file.ContentLength];
                    file.InputStream.Read(content, 0, file.ContentLength);

                    int returnId = new dcDbImages().Update(sqlCode, new dbImages
                    {
                        image_id = Convert.ToInt32(image_id),
                        image_name = file.FileName,
                        content_type = file.ContentType,
                    });

                    var fileName = string.Format("{0}{1}{2}", path, returnId, Path.GetExtension(file.FileName));
                    ByteArrayToFile(fileName, content);
                    return Json(new { isSuccess = true, msg = "ok", image_id = returnId });
                }
            }
            catch (Exception ex)
            {

                return Json(new { isSuccess = false, errMsg = ex.Message });
            }
        }

        public ActionResult viewImageDb(string sqlCode, string imageId)
        {
            try
            {
                using (new impersonate())
                {

                    var dc = new dcDbImages();
                    dbImages info = dc.GetInfo(sqlCode, Convert.ToInt32(imageId));

                    return base.File(info.file, info.content_type);
                }
            }
            catch
            {
                return base.File("/images/no-image.jpg", "image/jpeg");
            }
        }

        public ActionResult saveToFolder()
        {
            try
            {
                using (new impersonate())
                {
                    var path = AppSettings.BaseDirectory + @"images\dbimages\";
                    if(!Directory.Exists(path)) Directory.CreateDirectory(path);

                    var dc = new dcDbImages();
                    IList<dbImages> list = new List<dbImages>();
                    list = dc.GetAll("T83");
                    foreach (dbImages info in list) {
                        var fileName = string.Format("{0}{1}{2}", path, info.image_id, Path.GetExtension(info.image_name));
                        ByteArrayToFile(fileName, info.file);

                    };
                    return Json(new { isSuccess = true, msg= "success"});
                }
            }
            catch(Exception ex)
            {
                return Json(new { isSuccess = false, errMsg = ex.Message });
            }
        }



        public FileResult loadFile(string fileName)
        {
            using (new impersonate())
            {
                var path = this.tempPath;

                if (Directory.Exists(this.AppConfig.image_folder)) path = this.AppConfig.image_folder;
                var fullPath = Path.Combine(path, fileName);
                string contentType = MimeMapping.GetMimeMapping(fileName);
                return File(fullPath, contentType);
            }
        }

        public FileResult loadTmpFile(string subDir, string fileName)
        {
            using (new impersonate())
            {
                var _path = "";
                _path = this.AppConfig.network_group_folder + subDir;
                var fullPath = Path.Combine(_path, fileName);
                string contentType = MimeMapping.GetMimeMapping(fileName);
                return File(fullPath, contentType);
            }
        }

        public ContentResult checkFile(string fileName)
        {
            try
            {
                using (new impersonate())
                {
                    var path = this.tempPath;
                    if (Directory.Exists(this.AppConfig.image_folder)) path = this.AppConfig.image_folder;
                    var fullPath = Path.Combine(path, fileName);

                    return Content(System.IO.File.Exists(fullPath).ToString(), "text/plain", System.Text.Encoding.UTF8);
                }
            }
            catch (Exception ex)
            {

                return Content(ex.Message);
            }
        }

        public ActionResult generateExcelFile(string sql, string fileName)
        {
            try
            {
                using (new impersonate())
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
            }
            catch (Exception ex)
            {
                return Json(new { errMsg = ex.Message });
            }
        }

        public ActionResult generateHTMLToExcel(string sql, string fileName)
        {
            try
            {
                using (new impersonate())
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
            }
            catch (Exception ex)
            {
                return Json(new { errMsg = ex.Message });
            }

        }

        [HttpPost]
        public JsonResult deleteFiles(List<string> files, string root = "")
        {
            try
            {
                using (new impersonate())
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
                using (new impersonate())
                {
                    if (path != "") { if (!path.EndsWith(@"\")) path = path + @"\"; }
                    for (int x = 0; x < folders.Count; x++)
                    {
                        string _fullPath = this.AppConfig.network_group_folder + path + folders[x];
                        if (!Directory.Exists(_fullPath)) Directory.CreateDirectory(_fullPath);
                    }
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
                using (new impersonate())
                {
                    var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                    _folders = Directory.GetDirectories(_dir + path).Select(f => Path.GetFileName(f));
                }
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
                using (new impersonate())
                {
                    var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                    if (searchPattern != "")
                        _files = Directory.GetFiles(_dir + path, searchPattern).Select(f => Path.GetFileName(f));
                    else
                        _files = Directory.GetFiles(_dir + path).Select(f => Path.GetFileName(f));
                }
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
                using (new impersonate())
                {
                    var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                    using (StreamReader sr = new StreamReader(_dir + fileName))
                    {
                        _content = sr.ReadToEnd();
                    }
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
                using (new impersonate())
                {
                    var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                    using (StreamWriter sw = new StreamWriter(_dir + fileName))
                    {
                        sw.WriteLine(Uri.UnescapeDataString(content));
                    }
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
            using (new impersonate())
            {
                var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                byte[] fileBytes = System.IO.File.ReadAllBytes(_dir + fileName);
                return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
            }
        }

        public JsonResult deleteFile(string fileName, string root = "")
        {
            try
            {
                using (new impersonate())
                {
                    var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                    string filename = _dir + fileName;
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

        public JsonResult extractFile(string fileName, string root = "")
        {
            try
            {
                using (new impersonate())
                {
                    var _dir = (root == "" ? AppSettings.BaseDirectory : root);
                    string filename = _dir + fileName;
                    System.IO.FileInfo _fileInfo = new FileInfo(filename);
                    string filedirectory = _fileInfo.Directory.FullName;
                    ZipFile.ExtractToDirectory(filename, filedirectory);
                }
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
                using (new impersonate())
                {
                    if (file != null && file.ContentLength > 0)
                    {
                        var _dir = (root == "" ? AppSettings.BaseDirectory : (!root.Contains(":") ? AppSettings.BaseDirectory + root : root));
                        var fileName = Path.GetFileName(file.FileName);
                        var fullPath = _dir + fileName;
                        file.SaveAs(fullPath);
                    }
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
                using (new impersonate())
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

            }
            catch (Exception ex)
            {

                return Json(new { isSuccess = false, errMsg = ex.Message });
            }

            return Json(new { isSuccess = true, files = _fileNames.ToArray() });
        }


        public ActionResult downloadAppCodes(string isSelfBackup = "N", string dbFolders = "")
        {
            try
            {
                using (new impersonate())
                {
                    var _isSelfBackup = (isSelfBackup == "Y");
                    var _user = SessionHandler.CurrentUser.userName;

                    JavaScriptController.generateBackup(_isSelfBackup);
                    PageTemplateController.generateBackup(_isSelfBackup);

                    string root = AppSettings.dbWebSource;
                    string zipFileName = string.Format("{0}-app-codes.zip", _user);
                    string fullZipFileName = Path.Combine(root, zipFileName);

                    List<string> folderCollections = new List<string>();

                    if (_isSelfBackup)
                        folderCollections.AddRange(Directory.GetDirectories(root + @"\" + _user).ToArray());
                    else
                        folderCollections.AddRange(new string[] { root + "js", root + "template" });


                    string[] _dbFolders = dbFolders.Split(',');
                    foreach (var folder in _dbFolders)
                    {
                        if (folder != "")
                        {
                            SqlController.CreateBackupDbSqlScripts(folder);
                            folderCollections.Add(root + folder);
                        }
                    }

                    createProjectZipFile(fullZipFileName, folderCollections.ToArray());
                    return File(fullZipFileName, "application/zip", zipFileName);
                }
            }
            catch (Exception e)
            {

                return Content(e.Message, "text/plain");
            }

        }

        [HttpPost]
        public JsonResult uploadAppCodes(HttpPostedFileBase file)
        {
            try
            {
                using (new impersonate())
                {
                    var path = AppSettings.dbWebSource;
                    var fullPath = path;
                    var filename = "";

                    if (file != null && file.ContentLength > 0)
                    {
                        filename = Path.GetFileName(file.FileName);
                        fullPath = Path.Combine(path, filename);
                        file.SaveAs(fullPath);
                        updateWebCodes(fullPath);
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