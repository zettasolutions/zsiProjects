CREATE TABLE user_roles(
user_role_id	INT IDENTITY(1,1)	NOT NULL
,user_id	INT	NOT NULL
,role_id	INT	NOT NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	NCHAR(20)	NULL)