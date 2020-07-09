CREATE TYPE device_batch_tt AS TABLE(
batch_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,batch_no	NVARCHAR(40)	NULL
,batch_qty	INT	NULL
,invoice_no	NVARCHAR(40)	NULL
,invoice_date	DATE	NULL
,dr_no	NVARCHAR(40)	NULL
,supplier_id	INT	NULL
,received_date	DATE	NULL
,received_by	INT	NULL
,status_id	CHAR(1)	NULL)