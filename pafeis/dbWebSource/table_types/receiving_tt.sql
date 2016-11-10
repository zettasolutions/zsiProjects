CREATE TYPE receiving_tt AS TABLE(
receiving_id	INT	NULL
,receiving_receipt_no	NVARCHAR(100)	NULL
,warehouse_id	INT	NULL
,authority_id	INT	NULL
,supply_source_id	INT	NULL
,received_by	INT	NULL
,received_date	DATETIME	NULL
,status_id	INT	NULL
,status_remarks	NVARCHAR(0)	NULL)