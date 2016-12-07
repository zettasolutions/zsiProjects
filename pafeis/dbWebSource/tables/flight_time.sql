CREATE TABLE flight_time(
flight_time_id	INT IDENTITY(1,1)	NOT NULL
,flight_operation_id	INT	NOT NULL
,flight_take_off_time	DATETIME	NOT NULL
,flight_landing_time	DATETIME	NOT NULL
,is_engine_off	CHAR(1)	NULL
,no_hours	DECIMAL(12)	NOT NULL
,remarks	NVARCHAR(2000)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)