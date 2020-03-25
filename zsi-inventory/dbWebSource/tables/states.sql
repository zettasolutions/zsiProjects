CREATE TABLE states(
state_id	INT IDENTITY(1,1)	NOT NULL
,state_code	NVARCHAR(20)	NULL
,state_name	NVARCHAR(100)	NULL
,state_sname	NVARCHAR(20)	NULL
,country_id	INT	NULL)