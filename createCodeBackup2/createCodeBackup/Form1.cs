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
            dcJavaScript dc1 = new dcJavaScript();
            List<javascript> list1 = dc1.getMyFiles();
            foreach (javascript info in list1)
            {
                if (info.page_name != "")
                    settings.WriteFile("js\\", info.page_name + ".js", info.js_content);
            }
            txtMsg.AppendText (list1.Count + " Javascript files created/affected.");

            dcPage_template dc2 = new dcPage_template();
            List<page_template> list2 = dc2.getMyFiles();
            foreach (page_template info in list2)
            {
                if (info.page_name != "" && info.page_name!=null)
                    settings.WriteFile("template\\", info.page_name + ".html", info.pt_content);

            }

            txtMsg.AppendText("\r\n" + list2.Count + " Template files created/affected.");

            MessageBox.Show("Backup files has been created.");
        }

    }
}
