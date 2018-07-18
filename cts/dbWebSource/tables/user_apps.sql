CREATE TABLE user_apps(
user_app_id	INT IDENTITY(1,1)	NOT NULL
,user_id	INT	NOT NULL
,app_id	INT	NOT NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)