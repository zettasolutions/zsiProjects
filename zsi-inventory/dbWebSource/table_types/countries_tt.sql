CREATE TYPE countries_tt AS TABLE(
country_id	INT	NULL
,is_edited	CHAR(1)	NULL
,country_code	NVARCHAR(100)	NULL
,country_name	NVARCHAR(100)	NULL
,country_sname	NVARCHAR(100)	NULL)