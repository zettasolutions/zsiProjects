CREATE TABLE supply_types(
supply_type_id	INT IDENTITY(1,1)	NOT NULL
,supply_type	VARCHAR(100)	NOT NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)