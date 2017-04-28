CREATE TYPE receiving_details_tt AS TABLE(
receiving_detail_id	INT	NULL
,is_edited	CHAR(1)	NULL
,procurement_detail_id	INT	NULL
,receiving_id	INT	NULL
,item_code_id	INT	NULL
,serial_no	VARCHAR(50)	NULL
,manufacturer_id	INT	NULL
,unit_of_measure_id	INT	NULL
,quantity	DECIMAL(20)	NULL
,item_class_id	INT	NULL
,time_since_new	DECIMAL(10)	NULL
,time_since_overhaul	DECIMAL(10)	NULL
,status_id	INT	NULL
,remarks	NVARCHAR(0)	NULL)