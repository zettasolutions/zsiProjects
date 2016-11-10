CREATE TABLE monitoring_types(
monitoring_type_id	INT IDENTITY(1,1)	NOT NULL
,monitoring_type_code	NVARCHAR(30)	NOT NULL
,monitoring_type_name	NVARCHAR(100)	NOT NULL
,is_active	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)