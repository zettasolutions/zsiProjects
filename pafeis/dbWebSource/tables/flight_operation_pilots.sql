CREATE TABLE flight_operation_pilots(
flight_operation_pilot_id	INT IDENTITY(1,1)	NOT NULL
,flight_operation_id	INT	NULL
,pilot_id	INT	NULL
,duty	CHAR(5)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)