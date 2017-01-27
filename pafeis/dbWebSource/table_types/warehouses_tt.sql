CREATE TYPE warehouses_tt AS TABLE(
warehouse_id	INT	NULL
,is_edited	CHAR(1)	NULL
,squadron_id	INT	NULL
,warehouse_code	NVARCHAR(20)	NULL
,warehouse_location	NVARCHAR(1000)	NULL
,is_active	CHAR(1)	NULL)