CREATE TABLE applications(
app_id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NULL
,type_id	INT	NULL
,app_name	NVARCHAR(MAX)	NULL
,app_desc	NVARCHAR(MAX)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)