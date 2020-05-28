CREATE TABLE device_batch(
batch_id	INT IDENTITY(1,1)	NOT NULL
,batch_no	NVARCHAR(40)	NULL
,batch_qty	INT	NULL
,invoice_no	NVARCHAR(40)	NULL
,invoice_date	DATE	NULL
,dr_no	NVARCHAR(40)	NULL
,supplier_id	INT	NULL
,received_date	DATE	NULL
,received_by	INT	NULL
,status_id	INT	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)