CREATE TABLE device_types(
device_type_id	INT IDENTITY(1,1)	NOT NULL
,device_type_code	NVARCHAR(40)	NULL
,device_type	NVARCHAR(200)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)