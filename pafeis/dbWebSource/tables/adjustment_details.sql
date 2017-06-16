CREATE TABLE adjustment_details(
adjustment_detail_id	INT IDENTITY(1,1)	NOT NULL
,adjustment_id	INT	NULL
,adjustment_type_id	INT	NULL
,item_inv_id	INT	NULL
,serial_no	NVARCHAR(100)	NULL
,item_status_id	INT	NULL
,adjustment_qty	DECIMAL(12)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)