CREATE TABLE bw_locations(
bw_id	INT IDENTITY(1,1)	NOT NULL
,bw_code	NVARCHAR(40)	NOT NULL
,bw_name	NVARCHAR(100)	NOT NULL
,bw_address	NVARCHAR(1000)	NULL
,barangay_id	INT	NULL
,city_id	INT	NULL
,state_id	INT	NULL
,country_id	INT	NULL
,is_branch	CHAR(1)	NULL
,is_warehouse	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)