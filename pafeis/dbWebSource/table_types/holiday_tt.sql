CREATE TYPE holiday_tt AS TABLE(
holiday_id	INT	NULL
,holiday_desc	NVARCHAR(1000)	NULL
,h_month	NVARCHAR(20)	NULL
,h_day	INT	NULL
,holiday_type	CHAR(1)	NULL
,is_active	NCHAR(2)	NULL)