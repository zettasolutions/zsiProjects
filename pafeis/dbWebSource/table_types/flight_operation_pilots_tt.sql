CREATE TYPE flight_operation_pilots_tt AS TABLE(
flight_operation_pilot_id	INT	NULL
,is_edited	CHAR(1)	NULL
,flight_operation_id	INT	NULL
,pilot_id	INT	NULL
,duty	CHAR(5)	NULL)