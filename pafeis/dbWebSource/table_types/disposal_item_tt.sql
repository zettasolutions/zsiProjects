CREATE TYPE disposal_item_tt AS TABLE(
disposal_item_id	INT	NULL
,item_id	INT	NULL
,unit_of_measure_id	INT	NULL
,quantity	DECIMAL(20)	NULL
,authority_ref	NVARCHAR(2000)	NULL
,remarks	NVARCHAR(6000)	NULL
,status_id	INT	NULL)