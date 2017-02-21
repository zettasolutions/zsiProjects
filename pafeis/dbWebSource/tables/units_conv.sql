CREATE TABLE units_conv(
conv_id	INT IDENTITY(1,1)	NOT NULL
,from_unit_id	VARCHAR(64)	NULL
,unit_conv_id	VARCHAR(64)	NOT NULL
,unit_conv_qty	DECIMAL(7)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)