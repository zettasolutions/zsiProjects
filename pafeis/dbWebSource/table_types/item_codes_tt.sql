CREATE TYPE item_codes_tt AS TABLE(
item_code_id	INT	NULL
,item_type_id	INT	NULL
,part_no	NVARCHAR(60)	NULL
,national_stock_no	NVARCHAR(60)	NULL
,item_name	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL)