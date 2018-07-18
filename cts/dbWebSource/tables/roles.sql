CREATE TABLE roles(
role_id	INT IDENTITY(1,1)	NOT NULL
,role_name	NVARCHAR(40)	NOT NULL
,client_id	INT	NULL
,created_by	INT	NOT NULL
,created_date	DATETIMEOFFSET	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIMEOFFSET	NULL)