CREATE TABLE products(
product_id	INT IDENTITY(1,1)	NOT NULL
,product_code	NVARCHAR(40)	NULL
,product_desc	NTEXT(2147483646)	NULL
,product_srp	DECIMAL(12)	NULL
,t12_months	DECIMAL(12)	NULL
,t14_months	DECIMAL(12)	NULL
,t36_months	DECIMAL(12)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)