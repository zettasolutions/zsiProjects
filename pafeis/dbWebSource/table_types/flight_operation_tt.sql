CREATE TYPE flight_operation_tt AS TABLE(
flight_operation_id	INT	NULL
,flight_operation_code	NVARCHAR(100)	NULL
,flight_operation_name	NVARCHAR(1000)	NULL
,flight_operation_type_id	INT	NULL
,flight_schedule_date	DATETIME	NULL
,unit_id	INT	NULL
,aircraft_id	INT	NULL
,pilot_id	INT	NULL
,co_pilot_id	INT	NULL
,origin	NVARCHAR(1000)	NULL
,destination	NVARCHAR(1000)	NULL
,status_id	INT	NULL
,no_cycles	INT	NULL)