CREATE TABLE organization_types(
organization_type_id	INT IDENTITY(1,1)	NOT NULL
,level_no	INT	NULL
,organization_type_code	NVARCHAR(40)	NOT NULL
,organization_type_name	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)