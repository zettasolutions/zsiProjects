CREATE TABLE aircraft_class(
aircraft_class_id	INT IDENTITY(1,1)	NOT NULL
,aircraft_class	VARCHAR(300)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)