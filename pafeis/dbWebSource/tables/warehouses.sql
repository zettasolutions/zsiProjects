CREATE TABLE warehouses(
warehouse_id	INT IDENTITY(1,1)	NOT NULL
,squadron_id	INT	NULL
,warehouse_code	NVARCHAR(40)	NOT NULL
,warehouse_location	NVARCHAR(100)	NULL
,rr_no	INT	NULL
,is_no	INT	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)