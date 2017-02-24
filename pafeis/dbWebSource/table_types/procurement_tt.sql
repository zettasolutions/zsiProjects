CREATE TYPE procurement_tt AS TABLE(
procurement_id	INT	NULL
,procurement_date	DATETIME	NULL
,procurement_code	NVARCHAR(40)	NULL
,procurement_name	VARCHAR(500)	NULL
,supplier_id	INT	NULL
,supplier_promised_delivery_date	DATETIME	NULL
,status_id	INT	NULL
,is_edited	CHAR(1)	NULL)