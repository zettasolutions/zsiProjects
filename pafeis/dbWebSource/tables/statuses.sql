CREATE TABLE statuses(
status_id	INT IDENTITY(1,1)	NOT NULL
,status_code	VARCHAR(10)	NOT NULL
,status_name	VARCHAR(300)	NOT NULL
,status_color	VARCHAR(20)	NULL
,is_item	CHAR(1)	NULL
,is_aircraft	CHAR(1)	NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,is_process	CHAR(1)	NULL)