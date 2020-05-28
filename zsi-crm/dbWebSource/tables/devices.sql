CREATE TABLE devices(
device_id	INT IDENTITY(1,1)	NOT NULL
,batch_id	INT	NULL
,serial_no	NVARCHAR(40)	NULL
,tag_no	NVARCHAR(40)	NULL
,client_id	INT	NULL
,released_date	DATE	NULL
,assignment_id	INT	NULL
,device_type_id	INT	NULL
,is_active	CHAR(1)	NULL
,status_id	INT	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)