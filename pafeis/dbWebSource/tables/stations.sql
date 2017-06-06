CREATE TABLE stations(
station_id	INT IDENTITY(1,1)	NOT NULL
,station_code	NCHAR(20)	NULL
,station_name	NCHAR(20)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)