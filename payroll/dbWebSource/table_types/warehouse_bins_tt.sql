CREATE TYPE warehouse_bins_tt AS TABLE(
bin_id	INT	NULL
,is_edited	CHAR(1)	NULL
,warehouse_id	INT	NULL
,bin_code	NVARCHAR(40)	NULL
,is_active	CHAR(1)	NULL)