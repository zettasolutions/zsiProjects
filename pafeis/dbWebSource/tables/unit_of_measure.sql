CREATE TABLE unit_of_measure(
unit_of_measure_id	INT IDENTITY(1,1)	NOT NULL
,unit_of_measure_code	NVARCHAR(20)	NOT NULL
,unit_of_measure_name	NVARCHAR(600)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)