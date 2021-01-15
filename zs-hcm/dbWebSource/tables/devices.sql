CREATE TABLE devices(
device_id	INT IDENTITY(1,1)	NOT NULL
,hash_key	NVARCHAR(200)	NOT NULL
,company_id	INT	NOT NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)