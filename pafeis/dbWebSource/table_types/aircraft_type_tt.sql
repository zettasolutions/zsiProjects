CREATE TYPE aircraft_type_tt AS TABLE(
aircraft_type_id	INT	NULL
,aircraft_type	NVARCHAR(1000)	NULL
,manufacturer_id	INT	NULL
,origin_id	INT	NULL
,aircraft_class_id	INT	NULL
,aircraft_role_id	INT	NULL
,introduced_year	VARCHAR(4)	NULL
,in_service	INT	NULL
,note	NVARCHAR(2000)	NULL
,is_active	CHAR(1)	NULL)