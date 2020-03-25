CREATE TABLE cities(
city_id	INT IDENTITY(1,1)	NOT NULL
,city_code	NVARCHAR(20)	NULL
,city_name	NVARCHAR(100)	NULL
,city_sname	NVARCHAR(20)	NULL
,state_id	INT	NULL)