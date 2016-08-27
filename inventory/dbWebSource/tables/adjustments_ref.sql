CREATE TABLE adjustments_ref(
adjmt_id	INT IDENTITY(1,1)	NOT NULL
,adjmt_desc	VARCHAR(20)	NULL
,posted	INT	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)