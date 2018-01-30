CREATE TABLE holiday(
holiday_id	INT	NOT NULL
,holiday_desc	NVARCHAR(1000)	NOT NULL
,h_month	NVARCHAR(20)	NOT NULL
,h_day	INT	NULL
,holiday_type	CHAR(1)	NULL
,is_active	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)