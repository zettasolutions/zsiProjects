CREATE TABLE temp_users(
user_id	INT	NULL
,id_no	NVARCHAR(20)	NULL
,last_name	NVARCHAR(200)	NULL
,first_name	NVARCHAR(200)	NULL
,middle_name	NVARCHAR(200)	NULL
,name_suffix	NVARCHAR(20)	NULL
,contact_nos	VARCHAR(100)	NULL
,gender	CHAR(1)	NULL
,civil_status	CHAR(1)	NULL
,position	INT	NULL
,organization	INT	NULL
,rank	INT	NULL
,email_add	NVARCHAR(600)	NULL
,id	INT IDENTITY(1,1)	NOT NULL)