CREATE TYPE customers_tt AS TABLE(
customer_id	INT	NULL
,is_edited	CHAR(1)	NULL
,customer_code	VARCHAR(50)	NULL
,customer_name	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL)