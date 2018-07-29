CREATE TYPE item_status_tt AS TABLE(
item_id	INT	NULL
,is_edited	CHAR(1)	NULL
,remaining_time	DECIMAL(12)	NULL
,status_id	INT	NULL)