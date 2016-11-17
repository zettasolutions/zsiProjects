CREATE TYPE item_types_tt AS TABLE(
item_type_id	INT	NULL
,item_cat_id	INT	NULL
,monitoring_type_id	INT	NULL
,item_type_code	NVARCHAR(30)	NULL
,item_type_name	NVARCHAR(100)	NULL
,unit_of_measure_id	INT	NULL
,is_active	CHAR(1)	NULL)