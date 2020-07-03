CREATE TABLE devices(
device_id	INT IDENTITY(1,1)	NOT NULL
,company_code	NVARCHAR(100)	NOT NULL
,mac_address	NVARCHAR(100)	NOT NULL
,serial_no	NVARCHAR(100)	NOT NULL
,device_desc	NVARCHAR(200)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)