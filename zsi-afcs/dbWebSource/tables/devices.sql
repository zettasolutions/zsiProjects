CREATE TABLE devices(
device_id	INT IDENTITY(1,1)	NOT NULL
,company_code	NVARCHAR(100)	NULL
,mac_address	NVARCHAR(100)	NULL
,serial_no	NVARCHAR(100)	NOT NULL
,device_desc	NVARCHAR(200)	NULL
,is_active	CHAR(1)	NULL
,consumer_id	INT	NULL
,company_id	INT	NULL
,mobile_no	NVARCHAR(40)	NULL
,is_zfare	CHAR(1)	NULL
,is_zload	CHAR(1)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)