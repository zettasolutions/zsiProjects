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
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.btnDBCreateBackup = new System.Windows.Forms.Button();
            this.chkTables = new System.Windows.Forms.CheckBox();
            this.chkProc = new System.Windows.Forms.CheckBox();
            this.chkViews = new System.Windows.Forms.CheckBox();
            this.chkTableTypes = new System.Windows.Forms.CheckBox();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnCreateBackup
            // 
            this.btnCreateBackup.Location = new System.Drawing.Point(247, 7);
            this.btnCreateBackup.Name = "btnCreateBackup";
            this.btnCreateBackup.Size = new System.Drawing.Size(162, 30);
            this.btnCreateBackup.TabIndex = 0;
            this.btnCreateBackup.Text = "Create Web Codes Backup";
            this.btnCreateBackup.UseVisualStyleBackColor = true;
            this.btnCreateBackup.Click += new System.EventHandler(this.btnCreateBackup_Click);
            // 
            // txtMsg
            // 
            this.txtMsg.BackColor = System.Drawing.Color.White;
            this.txtMsg.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.txtMsg.Location = new System.Drawing.Point(3, 132);
            this.txtMsg.Multiline = true;
            this.txtMsg.Name = "txtMsg";
            this.txtMsg.ReadOnly = true;
            this.txtMsg.Size = new System.Drawing.Size(406, 95);
            this.txtMsg.TabIndex = 1;
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.chkTableTypes);
            this.groupBox1.Controls.Add(this.chkViews);
            this.groupBox1.Controls.Add(this.chkProc);
            this.groupBox1.Controls.Add(this.btnDBCreateBackup);
            this.groupBox1.Controls.Add(this.chkTables);
            this.groupBox1.Location = new System.Drawing.Point(3, 37);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(406, 89);
            this.groupBox1.TabIndex = 3;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Database";
            // 
            // btnDBCreateBackup
            // 
            this.btnDBCreateBackup.Location = new System.Drawing.Point(244, 42);
            this.btnDBCreateBackup.Name = "btnDBCreateBackup";
            this.btnDBCreateBackup.Size = new System.Drawing.Size(156, 30);
            this.btnDBCreateBackup.TabIndex = 3;
            this.btnDBCreateBackup.Text = "Create DB Scripts Backup";
            this.btnDBCreateBackup.UseVisualStyleBackColor = true;
            this.btnDBCreateBackup.Click += new System.EventHandler(this.btnDBCreateBackup_Click);
            // 
            // chkTables
            // 
            this.chkTables.AutoSize = true;
            this.chkTables.Location = new System.Drawing.Point(16, 19);
            this.chkTables.Name = "chkTables";
            this.chkTables.Size = new System.Drawing.Size(58, 17);
            this.chkTables.TabIndex = 4;
            this.chkTables.Text = "Tables";
            this.chkTables.UseVisualStyleBackColor = true;
            // 
            // chkProc
            // 
            this.chkProc.AutoSize = true;
            this.chkProc.Location = new System.Drawing.Point(140, 19);
            this.chkProc.Name = "chkProc";
            this.chkProc.Size = new System.Drawing.Size(138, 17);
            this.chkProc.TabIndex = 5;
            this.chkProc.Text = "Procedures && Functions";
            this.chkProc.UseVisualStyleBackColor = true;
            // 
            // chkViews
            // 
            this.chkViews.AutoSize = true;
            this.chkViews.Location = new System.Drawing.Point(80, 19);
            this.chkViews.Name = "chkViews";
            this.chkViews.Size = new System.Drawing.Size(54, 17);
            this.chkViews.TabIndex = 6;
            this.chkViews.Text = "Views";
            this.chkViews.UseVisualStyleBackColor = true;
            // 
            // chkTableTypes
            // 
            this.chkTableTypes.AutoSize = true;
            this.chkTableTypes.Location = new System.Drawing.Point(284, 19);
            this.chkTableTypes.Name = "chkTableTypes";
            this.chkTableTypes.Size = new System.Drawing.Size(85, 17);
            this.chkTableTypes.TabIndex = 7;
            this.chkTableTypes.Text = "Table Types";
            this.chkTableTypes.UseVisualStyleBackColor = true;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(418, 234);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.txtMsg);
            this.Controls.Add(this.btnCreateBackup);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Form1";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Create Backup";
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnCreateBackup;
        private System.Windows.Forms.TextBox txtMsg;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.CheckBox chkTableTypes;
        private System.Windows.Forms.CheckBox chkViews;
        private System.Windows.Forms.CheckBox chkProc;
        private System.Windows.Forms.Button btnDBCreateBackup;
        private System.Windows.Forms.CheckBox chkTables;
    }
}

