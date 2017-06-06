CREATE TABLE flight_time(
flight_operation_detail_id	INT IDENTITY(1,1)	NOT NULL
,flight_operation_id	INT	NOT NULL
,engine_start	DATETIME	NOT NULL
,engine_shutdown	DATETIME	NOT NULL
,no_hours	DECIMAL(12)	NOT NULL
,remarks	NVARCHAR(2000)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)