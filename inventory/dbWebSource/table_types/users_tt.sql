CREATE TYPE users_tt AS TABLE(
user_id	INT	NULL
,logon	NVARCHAR(40)	NULL
,last_name	NVARCHAR(200)	NULL
,first_name	NVARCHAR(200)	NULL
,middle_ini	NVARCHAR(2)	NULL
,is_requestor	VARCHAR(1)	NULL
,plant_id	INT	NULL
,role_id	INT	NULL
,position	VARCHAR(50)	NULL
,contact_nos	VARCHAR(50)	NULL
,is_contact	VARCHAR(1)	NULL
,is_active	VARCHAR(1)	NULL)