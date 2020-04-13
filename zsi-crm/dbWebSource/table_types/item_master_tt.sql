CREATE TYPE item_master_tt AS TABLE(
item_id	INT	NULL
,item_code	NVARCHAR(40)	NULL
,item_name	NVARCHAR(100)	NULL
,item_desc	NVARCHAR(2000)	NULL
,item_category_id	INT	NULL
,item_class_id	INT	NULL
,item_type_id	INT	NULL
,is_active	CHAR(1)	NULL)