CREATE TYPE organizations_tt AS TABLE(
organization_id	INT	NULL
,organization_type_id	INT	NULL
,organization_code	NVARCHAR(40)	NULL
,organization_name	NVARCHAR(100)	NULL
,organization_pid	INT	NULL
,organization_head_id	INT	NULL
,is_active	CHAR(1)	NULL)