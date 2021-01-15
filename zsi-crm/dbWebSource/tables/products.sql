CREATE TABLE products(
product_id	INT IDENTITY(1,1)	NOT NULL
,product_code	NVARCHAR(40)	NULL
,product_name	NVARCHAR(100)	NULL
,product_desc	NTEXT(2147483646)	NULL
,product_srp	DECIMAL(12)	NULL
,product_dp	DECIMAL(12)	NULL
,device_brand_id	INT	NULL
,device_type_id	INT	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)