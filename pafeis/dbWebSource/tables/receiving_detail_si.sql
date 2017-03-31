CREATE TABLE receiving_detail_si(
receiving_detail_si_id	INT IDENTITY(1,1)	NOT NULL
,receiving_detail_id	INT	NULL
,item_code_id	INT	NOT NULL
,serial_no	VARCHAR(50)	NULL
,unit_of_measure_id	INT	NOT NULL
,quantity	DECIMAL(20)	NOT NULL
,item_class_id	INT	NULL
,time_since_new	DATETIME	NULL
,time_before_overhaul	DATETIME	NULL
,time_since_overhaul	DATETIME	NULL
,status_id	INT	NULL
,manufacturer_id	INT	NULL)