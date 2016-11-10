CREATE TYPE wings_tt AS TABLE(
wing_id	INT	NULL
,wing_code	NVARCHAR(20)	NULL
,wing_name	NVARCHAR(1000)	NULL
,wing_full_address	NVARCHAR(2000)	NULL
,wing_commander_id	INT	NULL
,is_active	NCHAR(2)	NOT NULL)