CREATE TABLE employees_0(
id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NULL
,employee_no	NVARCHAR(100)	NULL
,last_name	NVARCHAR(100)	NULL
,first_name	NVARCHAR(100)	NULL
,middle_name	NVARCHAR(100)	NULL
,name_suffix	NVARCHAR(100)	NULL
,gender	CHAR(1)	NULL
,civil_status_code	CHAR(1)	NULL
,date_hired	DATE	NULL
,empl_type_code	CHAR(1)	NULL
,basic_pay	DECIMAL(20)	NULL
,pay_type_code	CHAR(1)	NULL
,sss_no	NVARCHAR(100)	NULL
,tin	NVARCHAR(100)	NULL
,philhealth_no	NVARCHAR(100)	NULL
,hmdf_no	NVARCHAR(100)	NULL
,account_no	NVARCHAR(100)	NULL
,no_shares	DECIMAL(12)	NULL
,contact_name	NVARCHAR(100)	NULL
,contact_phone_no	NVARCHAR(100)	NULL
,contact_address	NVARCHAR(200)	NULL
,contact_relation_id	INT	NULL
,position_id	INT	NULL
,department_id	INT	NULL
,section_id	INT	NULL
,emp_hash_key	NVARCHAR(1000)	NULL
,img_filename	IMAGE(2147483647)	NULL
,is_active	CHAR(1)	NULL
,inactive_type_code	CHAR(1)	NULL
,inactive_date	DATE	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,driver_academy_no	NVARCHAR(100)	NULL
,driver_license_no	NVARCHAR(100)	NULL
,driver_licence_img_filename	NVARCHAR(100)	NULL
,driver_license_exp_date	DATE	NULL
,transfer_type_id	INT	NULL
,bank_id	INT	NULL
,transfer_no	NVARCHAR(40)	NULL
,is_driver	CHAR(1)	NULL
,is_pao	CHAR(1)	NULL
,is_inspector	CHAR(1)	NULL)