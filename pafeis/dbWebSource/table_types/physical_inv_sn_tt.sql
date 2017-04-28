CREATE TYPE physical_inv_sn_tt AS TABLE(
physical_inv_sn_id	INT	NULL
,is_edited	CHAR(1)	NULL
,physical_inv_id	INT	NULL
,item_code_id	INT	NULL
,serial_no	NVARCHAR(60)	NULL
,status_id	INT	NOT NULL
,remaining_time	INT	NOT NULL
,no_repairs	INT	NOT NULL
,no_overhauls	INT	NOT NULL
,remarks	NVARCHAR(0)	NULL)