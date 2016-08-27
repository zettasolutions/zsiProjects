CREATE TABLE units(
unit_id	INT IDENTITY(1,1)	NOT NULL
,unit_sdesc	VARCHAR(50)	NOT NULL
,unit_desc	VARCHAR(100)	NOT NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)