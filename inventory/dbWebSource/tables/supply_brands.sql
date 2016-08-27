CREATE TABLE supply_brands(
supply_brand_id	INT IDENTITY(1,1)	NOT NULL
,brand_id	INT	NULL
,supply_id	INT	NULL
,conv_id	INT	NULL
,supply_cost	DECIMAL(9)	NULL
,store_id	INT	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)