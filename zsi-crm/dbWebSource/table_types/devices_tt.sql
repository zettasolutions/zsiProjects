CREATE TYPE devices_tt AS TABLE(
device_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,batch_id	INT	NULL
,serial_no	NVARCHAR(40)	NULL
,tag_no	NVARCHAR(40)	NULL
,client_id	INT	NULL
,released_date	DATE	NULL
,device_type_id	INT	NULL
,is_active	CHAR(1)	NULL
,status_id	INT	NULL)