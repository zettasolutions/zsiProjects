CREATE TYPE operation_types_tt AS TABLE(
operation_type_id	INT	NULL
,operation_type_code	NVARCHAR(30)	NULL
,operation_type_name	NVARCHAR(100)	NULL
,is_active	NCHAR(2)	NULL)