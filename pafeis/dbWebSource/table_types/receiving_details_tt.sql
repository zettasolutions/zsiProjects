CREATE TYPE receiving_details_tt AS TABLE(
receiving_detail_id	INT	NULL
,receiving_id	INT	NULL
,item_id	INT	NULL
,serial_no	VARCHAR(50)	NULL
,unit_of_measure_id	INT	NULL
,quantity	DECIMAL(20)	NULL
,item_class_id	INT	NULL
,remarks	NVARCHAR(0)	NULL)