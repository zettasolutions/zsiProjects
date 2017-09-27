CREATE TYPE monitoring_types_tt AS TABLE(
monitoring_type_id	INT	NULL
,monitoring_type_code	NVARCHAR(30)	NULL
,monitoring_type_name	NVARCHAR(600)	NULL
,is_active	CHAR(1)	NULL)