CREATE TABLE stores(
store_id	INT IDENTITY(1,1)	NOT NULL
,store_name	VARCHAR(100)	NOT NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)