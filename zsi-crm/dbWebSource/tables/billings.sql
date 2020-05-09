CREATE TABLE billings(
billing_period_id	INT IDENTITY(1,1)	NOT NULL
,billing_date	DATE	NULL
,billing_class_id	INT	NULL
,is_posted	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)