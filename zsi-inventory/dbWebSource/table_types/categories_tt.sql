CREATE TYPE categories_tt AS TABLE(
category_id	INT	NULL
,is_edited	CHAR(1)	NULL
,category_code	NVARCHAR(40)	NULL
,category_name	NVARCHAR(100)	NULL
,category_desc	NVARCHAR(2000)	NULL)