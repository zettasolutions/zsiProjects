CREATE TABLE items(
item_id	INT IDENTITY(1,1)	NOT NULL
,item_code_id	INT	NULL
,item_inv_id	INT	NULL
,serial_no	NVARCHAR(40)	NOT NULL
,manufacturer_id	INT	NULL
,dealer_id	INT	NULL
,supply_source_id	INT	NULL
,time_since_new	DECIMAL(12)	NULL
,time_before_overhaul	DECIMAL(12)	NULL
,time_since_overhaul	DECIMAL(12)	NULL
,remaining_time	DECIMAL(12)	NULL
,date_delivered	DATETIME	NULL
,aircraft_info_id	INT	NULL
,date_issued	DATETIME	NULL
,status_id	INT	NULL
,remarks	NTEXT(2147483646)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,item_class_id	INT	NULL
,no_repairs	INT	NULL
,no_overhauls	INT	NULL
,parent_item_id	INT	NULL)