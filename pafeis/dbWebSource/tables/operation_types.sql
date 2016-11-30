CREATE TABLE operation_types(
operation_type_id	INT IDENTITY(1,1)	NOT NULL
,operation_type_code	NVARCHAR(30)	NOT NULL
,operation_type_name	NVARCHAR(100)	NOT NULL
,is_active	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,unit_of_measure_id	INT	NULL)