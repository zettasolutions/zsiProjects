CREATE TABLE statuses(
status_id	INT IDENTITY(1,1)	NOT NULL
,status_code	VARCHAR(10)	NOT NULL
,status_name	VARCHAR(300)	NOT NULL
,status_color	VARCHAR(20)	NULL
,icon	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,is_edit	CHAR(1)	NULL
,is_delete	CHAR(1)	NULL)