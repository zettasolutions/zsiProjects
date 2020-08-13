CREATE TYPE devices_tt AS TABLE(
device_id	INT	NULL
,is_edited	CHAR(1)	NULL
,serial_no	NVARCHAR(100)	NULL
,device_desc	NVARCHAR(200)	NULL
,is_active	CHAR(1)	NULL)