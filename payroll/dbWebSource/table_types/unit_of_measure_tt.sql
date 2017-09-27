CREATE TYPE unit_of_measure_tt AS TABLE(
unit_of_measure_id	INT	NULL
,unit_of_measure_code	NVARCHAR(20)	NULL
,unit_of_measure_name	NVARCHAR(600)	NULL
,is_active	CHAR(1)	NULL)