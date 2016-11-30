CREATE TABLE flight_operation(
flight_operation_id	INT IDENTITY(1,1)	NOT NULL
,flight_operation_code	NVARCHAR(100)	NULL
,flight_operation_name	NVARCHAR(1000)	NOT NULL
,flight_operation_type_id	INT	NOT NULL
,flight_schedule_date	DATETIME	NOT NULL
,unit_id	INT	NULL
,aircraft_id	INT	NOT NULL
,pilot_id	INT	NOT NULL
,co_pilot_id	INT	NULL
,origin	NVARCHAR(1000)	NOT NULL
,destination	NVARCHAR(1000)	NOT NULL
,status_id	INT	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)