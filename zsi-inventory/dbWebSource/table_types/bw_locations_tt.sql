CREATE TYPE bw_locations_tt AS TABLE(
bw_id	INT	NULL
,bw_code	NVARCHAR(40)	NULL
,bw_name	NVARCHAR(100)	NULL
,bw_address	NVARCHAR(1000)	NULL
,barangay_id	INT	NULL
,city_id	INT	NULL
,state_id	INT	NULL
,country_id	INT	NULL
,is_branch	CHAR(1)	NULL
,is_warehouse	CHAR(1)	NULL)