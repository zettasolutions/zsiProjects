CREATE TABLE origin(
origin_id	INT IDENTITY(1,1)	NOT NULL
,origin_code	VARCHAR(20)	NOT NULL
,origin_name	VARCHAR(300)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)