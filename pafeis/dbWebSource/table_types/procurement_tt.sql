CREATE TYPE procurement_tt AS TABLE(
procurement_id	INT	NULL
,procurement_type	NVARCHAR(40)	NULL
,procurement_date	DATETIME	NULL
,procurement_code	NVARCHAR(40)	NULL
,procurement_name	VARCHAR(0)	NULL
,procurement_mode	VARCHAR(30)	NULL
,supplier_id	INT	NULL
,promised_delivery_date	DATETIME	NULL
,warehouse_id	INT	NULL
,status_id	INT	NULL
,is_edited	CHAR(1)	NULL)