CREATE TYPE issuance_directive_detail_tt AS TABLE(
issuance_directive_detail_id	INT	NULL
,issuance_directive_id	INT	NULL
,item_id	INT	NULL
,aircraft_id	INT	NULL
,unit_of_measure_id	INT	NULL
,quantity	DECIMAL(20)	NULL)