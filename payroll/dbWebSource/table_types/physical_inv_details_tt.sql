CREATE TYPE physical_inv_details_tt AS TABLE(
physical_inv_detail_id	INT	NULL
,is_edited	CHAR(1)	NULL
,physical_inv_id	INT	NULL
,item_code_id	INT	NULL
,quantity	DECIMAL(20)	NULL
,item_status_id	INT	NULL
,bin	NVARCHAR(200)	NULL
,remarks	NVARCHAR(0)	NULL)