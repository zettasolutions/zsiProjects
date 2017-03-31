CREATE TABLE procurement(
procurement_id	INT IDENTITY(1,1)	NOT NULL
,procurement_date	DATE	NOT NULL
,procurement_code	NVARCHAR(40)	NOT NULL
,procurement_name	TEXT(2147483647)	NOT NULL
,organization_id	INT	NOT NULL
,supplier_id	INT	NOT NULL
,promised_delivery_date	DATE	NOT NULL
,status_id	INT	NOT NULL
,actual_delivery_date	DATE	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,procurement_type	NVARCHAR(100)	NULL
,warehouse_id	INT	NULL
,procurement_mode	NVARCHAR(60)	NULL)