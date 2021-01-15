CREATE PROCEDURE [dbo].[create_employee_tbl](
 @client_id INT
)
AS
BEGIN
   DECLARE @stmt NVARCHAR(MAX)
   SET @stmt= 'CREATE TABLE [dbo].[employees_' + cast(@client_id AS VARCHAR(20)) + '](' +
	'[id] [int] IDENTITY(1,1) NOT NULL,'+
	'[client_id] [int] NULL,'+
	'[employee_no] [nvarchar](50) NULL,'+
	'[last_name] [nvarchar](50) NULL,'+
	'[first_name] [nvarchar](50) NULL,'+
	'[middle_name] [nvarchar](50) NULL,'+
	'[name_suffix] [nvarchar](50) NULL,'+
	'[gender] [char](1) NULL,'+
	'[civil_status_code] [char](1) NULL,'+
	'[date_hired] [date] NULL,'+
	'[empl_type_code] [char](1) NULL,'+
	'[basic_pay] [decimal](18, 2) NULL,'+
	'[pay_type_code] [char](1) NULL,'+
	'[sss_no] [nvarchar](50) NULL,'+
	'[tin] [nvarchar](50) NULL,'+
	'[philhealth_no] [nvarchar](50) NULL,'+
	'[hmdf_no] [nvarchar](50) NULL,'+
	'[account_no] [nvarchar](50) NULL,'+
	'[no_shares] [decimal](10, 2) NULL,'+
	'[contact_name] [nvarchar](50) NULL,'+
	'[contact_phone_no] [nvarchar](50) NULL,'+
	'[contact_address] [nvarchar](100) NULL,'+
	'[contact_relation_id] [int] NULL,'+
	'[position_id] [int] NULL,'+
	'[department_id] [int] NULL,'+
	'[section_id] [int] NULL,'+
	'[emp_hash_key] [nvarchar](500) NULL,'+
	'[img_filename] [varbinary](max) NULL,'+
	'[is_active] [char](1) NULL,'+
	'[inactive_type_code] [char](1) NULL,'+
	'[inactive_date] [date] NULL,'+
	'[created_by] [int] NULL,'+
	'[created_date] [datetime] NULL,'+
	'[updated_by] [int] NULL,'+
	'[updated_date] [datetime] NULL,'+
	'[driver_academy_no] [nvarchar](50) NULL,'+
	'[driver_license_no] [nvarchar](50) NULL,'+
	'[driver_licence_img_filename] [nvarchar](50) NULL,'+
	'[driver_license_exp_date] [date] NULL,'+
	'[transfer_type_id] [int] NULL,'+
	'[bank_id] [int] NULL,'+
	'[transfer_no] [nvarchar](20) NULL,'+
	'[is_driver] [char](1) NULL,'+
	'[is_pao] [char](1) NULL,'+
	'[is_inspector] [char](1) NULL,'+
	'[is_loader] [char](1) NULL,'+
 'CONSTRAINT [PK_employees_' + cast(@client_id AS VARCHAR(20)) + '] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]'
EXEC(@stmt);
END;



