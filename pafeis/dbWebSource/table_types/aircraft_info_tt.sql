CREATE TYPE aircraft_info_tt AS TABLE(
aircraft_info_id	INT	NULL
,is_edited	CHAR(1)	NULL
,aircraft_code	NVARCHAR(20)	NULL
,aircraft_name	NVARCHAR(600)	NULL
,aircraft_type_id	INT	NULL
,squadron_id	INT	NULL
,aircraft_time	DECIMAL(20)	NULL
,aircraft_source_id	INT	NULL
,aircraft_dealer_id	INT	NULL
,item_class_id	INT	NULL
,status_id	INT	NULL)