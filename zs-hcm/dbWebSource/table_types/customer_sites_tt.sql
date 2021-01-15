CREATE TYPE customer_sites_tt AS TABLE(
site_id	INT	NULL
,is_edited	CHAR(1)	NULL
,site_code	NVARCHAR(100)	NULL
,site_address	NVARCHAR(400)	NULL
,customer_code	NVARCHAR(40)	NULL
,is_active	CHAR(1)	NULL)