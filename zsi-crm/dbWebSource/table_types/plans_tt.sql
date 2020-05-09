CREATE TYPE plans_tt AS TABLE(
plan_id	INT	NULL
,is_edited	CHAR(1)	NULL
,plan_code	NCHAR(20)	NULL
,plan_desc	NVARCHAR(400)	NULL
,monthly_rate	DECIMAL(12)	NULL
,is_active	CHAR(1)	NULL)