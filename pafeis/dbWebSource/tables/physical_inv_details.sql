CREATE TABLE physical_inv_details(
physical_inv_detail_id	INT IDENTITY(1,1)	NOT NULL
,physical_inv_id	INT	NOT NULL
,item_code_id	INT	NULL
,serial_no	NVARCHAR(60)	NULL
,quantity	DECIMAL(20)	NOT NULL
,prev_qty	DECIMAL(20)	NULL
,bin	NVARCHAR(200)	NULL
,remarks	NTEXT(2147483646)	NULL
,manufacturer_id	INT	NULL
,dealer_id	INT	NULL
,supply_source_id	INT	NULL
,time_since_new	DECIMAL(12)	NULL
,time_before_overhaul	DECIMAL(12)	NULL
,time_since_overhaul	DECIMAL(12)	NULL
,remaining_time	DECIMAL(12)	NULL
,date_delivered	DATETIME	NULL
,no_repairs	INT	NULL
,no_overhauls	INT	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)