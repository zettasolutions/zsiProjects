CREATE TABLE client_applications(
client_app_id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NULL
,app_id	INT	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)