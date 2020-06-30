CREATE TYPE vehicles_tt AS TABLE(
vehicle_id	INT	NULL
,company_id	INT	NULL
,is_edited	CHAR(1)	NULL
,vehicle_plate_no	VARCHAR(50)	NULL
,route_id	INT	NULL
,hash_key	VARCHAR(50)	NULL
,vehicle_type_id	INT	NULL
,transfer_type_id	INT	NULL
,bank_id	INT	NULL
,transfer_no	VARCHAR(20)	NULL
,account_name	VARCHAR(20)	NULL
,is_active	CHAR(1)	NULL)