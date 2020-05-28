CREATE TYPE device_types_tt AS TABLE(
device_type_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,device_type_code	NVARCHAR(40)	NULL
,device_type	NVARCHAR(200)	NULL
,device_type_desc	NVARCHAR(0)	NULL
,is_active	CHAR(1)	NULL)