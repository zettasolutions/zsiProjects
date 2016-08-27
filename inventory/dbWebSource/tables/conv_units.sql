CREATE TABLE conv_units(
conv_id	INT IDENTITY(1,1)	NOT NULL
,from_unit_id	VARCHAR(64)	NULL
,conv_unit_id	VARCHAR(64)	NOT NULL
,conv_unit_qty	DECIMAL(7)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)