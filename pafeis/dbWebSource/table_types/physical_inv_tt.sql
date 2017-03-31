CREATE TYPE physical_inv_tt AS TABLE(
physical_inv_id	INT	NULL
,is_edited	CHAR(1)	NULL
,physical_inv_date	DATETIME	NULL
,warehouse_id	INT	NULL
,done_by	INT	NULL
,status_id	INT	NULL
,status_remarks	NVARCHAR(0)	NULL)