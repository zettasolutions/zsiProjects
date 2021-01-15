CREATE TABLE device_brands(
device_brand_id	INT IDENTITY(1,1)	NOT NULL
,device_brand_code	NVARCHAR(40)	NULL
,device_brand_name	NVARCHAR(200)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NOT NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)