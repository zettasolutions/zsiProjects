CREATE TYPE users_tt AS TABLE(
app_user_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,client_id	INT	NULL
,last_name	NVARCHAR(200)	NULL
,first_name	NVARCHAR(200)	NULL
,middle_name	NVARCHAR(200)	NULL
,name_suffix	NVARCHAR(20)	NULL
,email_add	NVARCHAR(200)	NULL
,landline_no	VARCHAR(50)	NULL
,mobile_no1	VARCHAR(50)	NULL
,mobile_no2	VARCHAR(50)	NULL
,logon	NVARCHAR(100)	NULL
,password	NVARCHAR(100)	NULL
,is_developer	CHAR(1)	NULL
,is_add	CHAR(1)	NULL
,is_admin	VARCHAR(1)	NULL
,is_active	VARCHAR(1)	NULL)