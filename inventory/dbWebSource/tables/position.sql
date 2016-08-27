CREATE TABLE position(
position_id	INT IDENTITY(1,1)	NOT NULL
,position_name	VARCHAR(250)	NOT NULL
,job_description	TEXT(2147483647)	NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)