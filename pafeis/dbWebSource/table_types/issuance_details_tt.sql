CREATE TYPE issuance_details_tt AS TABLE(
issuance_detail_id	INT	NULL
,is_edited	CHAR(1)	NULL
,issuance_id	INT	NULL
,item_inv_id	INT	NULL
,serial_no	NVARCHAR(60)	NULL
,quantity	DECIMAL(20)	NULL
,remarks	NVARCHAR(0)	NULL)