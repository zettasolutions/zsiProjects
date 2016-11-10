CREATE TYPE items_tt AS TABLE(
item_id	INT	NULL
,item_code_id	INT	NULL
,serial_no	NVARCHAR(40)	NULL
,manufacturer_id	INT	NULL
,dealer_id	INT	NULL
,supply_source_id	INT	NULL
,time_since_new	DATETIME	NULL
,time_before_overhaul	DATETIME	NULL
,time_since_overhaul	DATETIME	NULL
,remaining_time	DATETIME	NULL
,date_delivered	DATETIME	NULL
,aircraft_info_id	INT	NULL
,date_issued	DATETIME	NULL
,status_id	INT	NULL)