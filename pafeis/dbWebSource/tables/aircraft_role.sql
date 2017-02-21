CREATE TABLE aircraft_role(
aircraft_role_id	INT IDENTITY(1,1)	NOT NULL
,aircraft_role	VARCHAR(300)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)