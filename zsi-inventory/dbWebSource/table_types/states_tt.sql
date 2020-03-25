CREATE TYPE states_tt AS TABLE(
state_id	INT	NULL
,is_edited	CHAR(1)	NULL
,state_code	NVARCHAR(20)	NULL
,state_name	NVARCHAR(100)	NULL
,state_sname	NVARCHAR(20)	NULL
,country_id	INT	NULL)