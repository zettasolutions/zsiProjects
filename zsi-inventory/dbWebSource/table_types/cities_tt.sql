CREATE TYPE cities_tt AS TABLE(
city_id	INT	NULL
,is_edited	CHAR(1)	NULL
,city_code	NVARCHAR(20)	NULL
,city_name	NVARCHAR(100)	NULL
,city_sname	NVARCHAR(20)	NULL
,state_id	INT	NULL)