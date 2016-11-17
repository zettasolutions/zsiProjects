CREATE TYPE receiving_details_tt AS TABLE(
receiving_detail_id	INT	NULL
,receiving_id	INT	NULL
,item_id	INT	NULL
,unit_of_measure_id	INT	NULL
,quantity	DECIMAL(20)	NULL
,remarks	NVARCHAR(0)	NULL)