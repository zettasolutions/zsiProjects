CREATE TYPE clients_tt AS TABLE(
client_Id	INT	NULL
,client_code	NVARCHAR(20)	NULL
,client_name	NVARCHAR(200)	NULL
,address	NVARCHAR(200)	NULL
,contact_number	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL
,request_no	INT	NULL
,is_edited	CHAR(1)	NULL)