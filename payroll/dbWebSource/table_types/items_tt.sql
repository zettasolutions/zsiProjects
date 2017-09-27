CREATE TYPE items_tt AS TABLE(
item_id	INT	NULL
,is_edited	CHAR(1)	NULL
,parent_item_id	INT	NULL
,item_code_id	INT	NULL
,serial_no	NVARCHAR(40)	NULL
,manufacturer_id	INT	NULL
,dealer_id	INT	NULL
,supply_source_id	INT	NULL
,time_since_new	DECIMAL(12)	NULL
,time_before_overhaul	DECIMAL(12)	NULL
,time_since_overhaul	DECIMAL(12)	NULL
,remaining_time	NVARCHAR(60)	NULL
,date_delivered	DATETIME	NULL
,aircraft_info_id	INT	NULL
,date_issued	DATETIME	NULL
,status_id	INT	NULL)