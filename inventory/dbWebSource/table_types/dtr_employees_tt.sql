CREATE TYPE dtr_employees_tt AS TABLE(
dtr_id	INT	NULL
,user_id	INT	NULL
,full_name	NVARCHAR(200)	NULL
,time_in	DATETIME	NULL
,time_out	DATETIME	NULL)