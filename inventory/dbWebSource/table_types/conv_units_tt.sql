CREATE TYPE conv_units_tt AS TABLE(
conv_id	INT	NULL
,from_unit_id	NVARCHAR(128)	NULL
,conv_unit_id	NVARCHAR(128)	NULL
,conv_unit_qty	DECIMAL(7)	NULL)