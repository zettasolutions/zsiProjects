CREATE TABLE barangays(
barangay_id	INT IDENTITY(1,1)	NOT NULL
,barangay_code	NVARCHAR(20)	NOT NULL
,barangay_name	NVARCHAR(100)	NULL
,barangay_sname	NVARCHAR(20)	NULL
,state_id	INT	NULL)