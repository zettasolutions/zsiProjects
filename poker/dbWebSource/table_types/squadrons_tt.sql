CREATE TYPE squadrons_tt AS TABLE(
squadron_id	INT	NULL
,wing_id	INT	NULL
,squadron_type_id	INT	NULL
,squadron_code	NVARCHAR(20)	NULL
,squadron_name	NVARCHAR(1000)	NULL
,squadron_commander_id	INT	NULL
,squadron_full_address	NVARCHAR(2000)	NULL
,is_active	NCHAR(2)	NULL)