CREATE TYPE adjustment_details_tt AS TABLE(
adjustment_detail_id	INT	NULL
,is_edited	CHAR(1)	NULL
,adjustment_id	INT	NULL
,adjustment_type_id	INT	NULL
,item_inv_id	INT	NULL
,serial_no	NVARCHAR(100)	NULL
,item_status_id	INT	NULL
,adjustment_qty	DECIMAL(12)	NULL)