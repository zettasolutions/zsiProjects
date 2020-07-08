CREATE TABLE plans(
plan_id	INT IDENTITY(1,1)	NOT NULL
,plan_code	NCHAR(20)	NULL
,plan_desc	NTEXT(2147483646)	NULL
,monthly_rate	DECIMAL(12)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)