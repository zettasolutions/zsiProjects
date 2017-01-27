CREATE TYPE organization_groups_tt AS TABLE(
organization_group_id	INT	NULL
,seq_no	INT	NULL
,organization_group_code	NVARCHAR(40)	NULL
,organization_group_name	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL)