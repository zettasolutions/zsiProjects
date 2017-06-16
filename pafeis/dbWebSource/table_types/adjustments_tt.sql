CREATE TYPE adjustments_tt AS TABLE(
adjustment_id	INT	NULL
,is_edited	CHAR(1)	NULL
,adjustment_date	DATE	NULL
,warehouse_id	INT	NULL
,adjustment_by	INT	NULL
,status_id	INT	NULL
,adjustment_remarks	NVARCHAR(0)	NULL)