CREATE TYPE flight_time_tt AS TABLE(
flight_operation_detail_id	INT	NULL
,is_edited	CHAR(1)	NULL
,flight_operation_id	INT	NULL
,engine_start	DATETIME	NULL
,engine_shutdown	DATETIME	NULL
,no_hours	DECIMAL(12)	NULL
,remarks	NVARCHAR(2000)	NULL)