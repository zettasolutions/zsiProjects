CREATE TABLE cut_off_dates(
cut_off_id	INT IDENTITY(1,1)	NOT NULL
,from_date	DATE	NULL
,to_date	DATE	NULL
,is_posted	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)