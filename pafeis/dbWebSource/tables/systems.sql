CREATE TABLE systems(
system_id	INT IDENTITY(1,1)	NOT NULL
,system_name	VARCHAR(64)	NOT NULL
,system_desc	VARCHAR(100)	NOT NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)