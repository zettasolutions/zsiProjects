CREATE TABLE users(
user_id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NULL
,hash_key	NVARCHAR(200)	NULL
,logon	NVARCHAR(100)	NOT NULL
,last_name	NVARCHAR(200)	NOT NULL
,first_name	NVARCHAR(200)	NOT NULL
,middle_name	NVARCHAR(2)	NULL
,role_id	INT	NULL
,plant_id	NVARCHAR(100)	NULL
,warehouse_id	NVARCHAR(100)	NULL
,password	NVARCHAR(100)	NULL
,name_suffix	NVARCHAR(100)	NULL
,is_admin	VARCHAR(1)	NULL
,is_active	VARCHAR(1)	NULL
,img_filename	VARCHAR(200)	NULL
,is_developer	VARCHAR(1)	NULL
,is_crm	CHAR(1)	NULL
,is_afcs	CHAR(1)	NULL
,is_hcm	CHAR(1)	NULL
,is_fmis	CHAR(1)	NULL
,is_ct	CHAR(1)	NULL
,is_ltfrb	CHAR(1)	NULL
,is_lto	CHAR(1)	NULL
,bank_id	INT	NULL
,lto_id	INT	NULL
,created_by	INT	NOT NULL
,created_date	DATETIMEOFFSET	NULL
,updated_by	INT	NULL
,updated_date	DATETIMEOFFSET	NULL)