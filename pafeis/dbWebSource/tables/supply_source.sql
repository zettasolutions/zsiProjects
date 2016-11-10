CREATE TABLE supply_source(
supply_source_id	INT IDENTITY(1,1)	NOT NULL
,supply_source_name	VARCHAR(300)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)