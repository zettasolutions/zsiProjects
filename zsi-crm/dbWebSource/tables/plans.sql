CREATE TABLE plans(
plan_id	INT IDENTITY(1,1)	NOT NULL
,product_id	INT	NULL
,plan_srp	DECIMAL(12)	NULL
,plan_dp	DECIMAL(12)	NULL
,plan_start_date	DATE	NULL
,plan_end_date	DATE	NULL
,is_promo	CHAR(1)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)