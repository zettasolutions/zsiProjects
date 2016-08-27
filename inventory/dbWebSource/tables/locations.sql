CREATE TABLE locations(
loc_id	INT IDENTITY(1,1)	NOT NULL
,location	VARCHAR(200)	NOT NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,loc_group_id	INT	NULL)