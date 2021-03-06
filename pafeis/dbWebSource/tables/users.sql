CREATE TABLE users(
user_id	INT IDENTITY(1,1)	NOT NULL
,logon	NVARCHAR(40)	NULL
,last_name	NVARCHAR(200)	NULL
,first_name	NVARCHAR(200)	NULL
,middle_name	NVARCHAR(200)	NULL
,password	NVARCHAR(400)	NULL
,role_id	INT	NULL
,is_active	VARCHAR(1)	NULL
,is_admin	VARCHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIMEOFFSET	NULL
,updated_by	INT	NULL
,updated_date	DATETIMEOFFSET	NULL
,contact_nos	VARCHAR(100)	NULL
,img_filename	VARCHAR(200)	NULL
,id_no	NVARCHAR(20)	NULL
,name_suffix	NVARCHAR(20)	NULL
,gender	CHAR(1)	NULL
,organization_id	INT	NULL
,email_add	NVARCHAR(600)	NULL
,squadron_id	INT	NULL
,rank_id	INT	NULL
,is_contact	CHAR(1)	NULL
,civil_status	CHAR(1)	NULL
,is_employee	CHAR(1)	NULL
,position_id	INT	NULL
,is_developer	CHAR(1)	NULL
,warehouse_id	INT	NULL
,is_pilot	CHAR(1)	NULL
,last_activity_dt	DATETIME	NULL)