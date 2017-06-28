using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace createCodeBackup
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }


        private void btnCreateBackup_Click(object sender, EventArgs e)
        {
            btnCreateBackup.Enabled = false;
            dcJavaScript dc1 = new dcJavaScript();
            List<javascript> list1 = dc1.getMyFiles();
            foreach (javascript info in list1)
            {
                if (info.page_name != "")
                    settings.WriteFile("js\\", info.page_name + ".js", info.js_content);
            }
            txtMsg.AppendText(list1.Count + " Javascript files created/affected.");

            dcPage_template dc2 = new dcPage_template();
            List<page_template> list2 = dc2.getMyFiles();
            foreach (page_template info in list2)
            {
                if (info.page_name != "" && info.page_name != null)
                    settings.WriteFile("template\\", info.page_name + ".html", info.pt_content);

            }

            txtMsg.AppendText("\r\n" + list2.Count + " Template files created/affected.");

            MessageBox.Show("Backup files has been created.");

            btnCreateBackup.Enabled = true;
        }



        void writeFiles(List<fileModel> list, string subFolder, string Title)
        {
            foreach (fileModel info in list)
            {
                string value = info.content.Replace("TEXT(2147483647)", "VARCHAR(MAX)");

                settings.WriteFile(subFolder + "\\", info.fileName + ".sql", value);
            }
            txtMsg.AppendText(list.Count + "  " + Title + " files created/affected." + "\r\n");
        }

        private void btnDBCreateBackup_Click(object sender, EventArgs e)
        {
            btnDBCreateBackup.Enabled = false;
            bool isBackupCreated = false;
            if (chkTables.Checked)
            {

                try
                {
                    dcTable dcView = new dcTable();
                    writeFiles(dcView.getList(), "tables", "Tables");
                    isBackupCreated = true;
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }


            if (chkProc.Checked)
            {
                try
                {
                    dcProcedure dcProc = new dcProcedure();
                    writeFiles(dcProc.getList(), "procedures_functions", "Procedures and Functions");
                    isBackupCreated = true;
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }

            if (chkViews.Checked)
            {
                try
                {
                    dcView dcView = new dcView();
                    writeFiles(dcView.getList(), "views", "Views");
                    isBackupCreated = true;
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }


            if (chkTableTypes.Checked)
            {
                try
                {
                    dcTableTypes dcTTypes = new dcTableTypes();
                    writeFiles(dcTTypes.getList(), "table_types", "Table Types");
                    isBackupCreated = true;
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }

            if (isBackupCreated)
                MessageBox.Show("Backup has been created.");
            else
                MessageBox.Show("Please select item(s) to create database script backup.");

            btnDBCreateBackup.Enabled = true;
        }

      
    }
}
