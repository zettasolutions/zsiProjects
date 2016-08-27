namespace createCodeBackup
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btnCreateBackup = new System.Windows.Forms.Button();
            this.txtMsg = new System.Windows.Forms.TextBox();
            this.btnCreateDBBackup = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnCreateBackup
            // 
            this.btnCreateBackup.Location = new System.Drawing.Point(12, 12);
            this.btnCreateBackup.Name = "btnCreateBackup";
            this.btnCreateBackup.Size = new System.Drawing.Size(153, 30);
            this.btnCreateBackup.TabIndex = 0;
            this.btnCreateBackup.Text = "Create Web Codes Backup";
            this.btnCreateBackup.UseVisualStyleBackColor = true;
            this.btnCreateBackup.Click += new System.EventHandler(this.btnCreateBackup_Click);
            // 
            // txtMsg
            // 
            this.txtMsg.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.txtMsg.Location = new System.Drawing.Point(12, 48);
            this.txtMsg.Multiline = true;
            this.txtMsg.Name = "txtMsg";
            this.txtMsg.Size = new System.Drawing.Size(298, 46);
            this.txtMsg.TabIndex = 1;
            // 
            // btnCreateDBBackup
            // 
            this.btnCreateDBBackup.Location = new System.Drawing.Point(171, 12);
            this.btnCreateDBBackup.Name = "btnCreateDBBackup";
            this.btnCreateDBBackup.Size = new System.Drawing.Size(139, 30);
            this.btnCreateDBBackup.TabIndex = 2;
            this.btnCreateDBBackup.Text = "Create DBScript Backup";
            this.btnCreateDBBackup.UseVisualStyleBackColor = true;
            this.btnCreateDBBackup.Click += new System.EventHandler(this.btnCreateDBBackup_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(323, 104);
            this.Controls.Add(this.btnCreateDBBackup);
            this.Controls.Add(this.txtMsg);
            this.Controls.Add(this.btnCreateBackup);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Form1";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Create Backup";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnCreateBackup;
        private System.Windows.Forms.TextBox txtMsg;
        private System.Windows.Forms.Button btnCreateDBBackup;
    }
}

