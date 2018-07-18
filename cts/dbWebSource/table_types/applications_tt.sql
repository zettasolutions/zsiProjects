CREATE TYPE applications_tt AS TABLE(
app_id	INT	NULL
,is_edited	CHAR(1)	NULL
,app_name	NVARCHAR(200)	NULL
,app_desc	NVARCHAR(0)	NULL
,is_active	CHAR(1)	NULL)