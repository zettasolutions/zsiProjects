CREATE TYPE products_tt AS TABLE(
product_id	INT	NULL
,is_edited	CHAR(1)	NULL
,product_code	NVARCHAR(40)	NULL
,product_name	NVARCHAR(100)	NULL
,product_desc	NVARCHAR(0)	NULL
,product_srp	DECIMAL(12)	NULL
,product_dp	DECIMAL(12)	NULL
,device_brand_id	INT	NULL
,device_type_id	INT	NULL)