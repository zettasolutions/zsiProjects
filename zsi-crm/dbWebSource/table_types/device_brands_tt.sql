CREATE TYPE device_brands_tt AS TABLE(
device_brand_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,device_type_id	INT	NULL
,device_brand_code	NVARCHAR(40)	NULL
,device_brand_name	NVARCHAR(200)	NULL
,is_active	CHAR(1)	NULL)