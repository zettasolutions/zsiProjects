CREATE TABLE types(
type_id	INT IDENTITY(1,1)	NOT NULL
,type_desc	NVARCHAR(MAX)	NULL
,category_id	INT	NULL
,client_id	INT	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)