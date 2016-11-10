CREATE TABLE flight_time(
flight_time_id	INT IDENTITY(1,1)	NOT NULL
,unit_id	INT	NOT NULL
,aircraft_id	INT	NOT NULL
,operation_id	INT	NOT NULL
,flight_time	DATETIME	NOT NULL
,status_id	INT	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)