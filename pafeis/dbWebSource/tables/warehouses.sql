CREATE TABLE warehouses(
warehouse_id	INT IDENTITY(1,1)	NOT NULL
,wing_id	INT	NOT NULL
,warehouse_code	NVARCHAR(20)	NOT NULL
,warehouse_name	NVARCHAR(1000)	NOT NULL
,warehouse_full_address	NVARCHAR(2000)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)