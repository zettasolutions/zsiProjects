CREATE TYPE warehouses_tt AS TABLE(
warehouse_id	INT	NULL
,wing_id	INT	NULL
,warehouse_code	NVARCHAR(20)	NULL
,warehouse_name	NVARCHAR(1000)	NULL
,warehouse_full_address	NVARCHAR(2000)	NULL
,is_active	CHAR(1)	NULL)