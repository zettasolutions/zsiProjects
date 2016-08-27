CREATE TYPE supplies_tt AS TABLE(
supply_id	INT	NULL
,seq_no	INT	NULL
,supply_code	NVARCHAR(50)	NULL
,supply_desc	NVARCHAR(200)	NULL
,supply_type_id	INT	NULL
,unit_id	INT	NULL
,supply_srp	DECIMAL(9)	NULL
,weight_serve	DECIMAL(9)	NULL
,supply_cost	DECIMAL(9)	NULL
,store_id	INT	NULL)