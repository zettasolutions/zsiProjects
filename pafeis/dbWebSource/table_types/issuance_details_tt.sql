CREATE TYPE issuance_details_tt AS TABLE(
issuance_detail_id	INT	NULL
,issuance_id	INT	NULL
,item_id	INT	NULL
,aircraft_id	INT	NULL
,unit_of_measure_id	INT	NULL
,quantity	DECIMAL(20)	NULL
,remarks	NVARCHAR(0)	NULL)