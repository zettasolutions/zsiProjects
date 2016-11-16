CREATE TYPE organization_types_tt AS TABLE(
organization_type_id	INT	NULL
,level_no	INT	NULL
,organization_type_code	NVARCHAR(40)	NULL
,organization_type_name	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL)