CREATE TABLE procurement(
procurement_id	INT IDENTITY(1,1)	NOT NULL
,procurement_date	DATE	NOT NULL
,procurement_code	NVARCHAR(40)	NOT NULL
,procurement_name	TEXT(2147483647)	NULL
,organization_id	INT	NOT NULL
,supplier_id	INT	NULL
,promised_delivery_date	DATE	NULL
,status_id	INT	NOT NULL
,actual_delivery_date	DATE	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,procurement_type	NVARCHAR(100)	NULL
,warehouse_id	INT	NULL
,procurement_mode	NVARCHAR(60)	NOT NULL
,po_code	NVARCHAR(100)	NULL
,bac_code	NVARCHAR(100)	NULL
,img_filename	NVARCHAR(100)	NULL
,po_date	DATE	NULL
,bac_date	DATE	NULL)