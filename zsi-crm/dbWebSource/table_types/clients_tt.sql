CREATE TYPE clients_tt AS TABLE(
client_id	INT	NULL
,client_code	CHAR(10)	NULL
,client_name	NVARCHAR(100)	NULL
,client_phone_no	NVARCHAR(40)	NULL
,client_mobile_no	NVARCHAR(40)	NULL
,client_email_add	NVARCHAR(60)	NULL
,is_active	CHAR(1)	NULL
,billing_address	NVARCHAR(0)	NULL)