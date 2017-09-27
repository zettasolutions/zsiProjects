CREATE TYPE units_conv_tt AS TABLE(
conv_id	INT	NULL
,from_unit_id	NVARCHAR(128)	NULL
,unit_conv_id	NVARCHAR(128)	NULL
,unit_conv_qty	DECIMAL(7)	NULL)