CREATE TABLE adjustments(
adjustment_id	INT IDENTITY(1,1)	NOT NULL
,adjustment_no	NVARCHAR(100)	NULL
,adjustment_date	DATE	NULL
,warehouse_id	INT	NULL
,adjustment_by	INT	NULL
,adjustment_remarks	NTEXT(2147483646)	NULL
,status_id	INT	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)