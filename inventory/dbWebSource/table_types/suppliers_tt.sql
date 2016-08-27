CREATE TYPE suppliers_tt AS TABLE(
supplier_id	INT	NULL
,supplier_name	NVARCHAR(400)	NULL
,contact_name	NVARCHAR(400)	NULL
,contact_no	NVARCHAR(200)	NULL
,is_active	CHAR(1)	NULL)