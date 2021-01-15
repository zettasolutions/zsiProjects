CREATE TABLE types(
type_id	INT IDENTITY(1,1)	NOT NULL
,type_code	NVARCHAR(40)	NOT NULL
,type_name	NVARCHAR(100)	NOT NULL
,type_desc	NVARCHAR(2000)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)