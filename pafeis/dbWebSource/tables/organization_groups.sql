CREATE TABLE organization_groups(
organization_group_id	INT IDENTITY(1,1)	NOT NULL
,seq_no	INT	NULL
,organization_group_code	NVARCHAR(40)	NOT NULL
,organization_group_name	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)