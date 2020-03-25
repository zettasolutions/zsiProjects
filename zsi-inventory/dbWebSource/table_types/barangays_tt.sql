CREATE TYPE barangays_tt AS TABLE(
barangay_id	INT	NULL
,is_edited	CHAR(1)	NULL
,barangay_code	NVARCHAR(20)	NULL
,barangay_name	NVARCHAR(100)	NULL
,barangay_sname	NVARCHAR(20)	NULL
,state_id	INT	NULL)