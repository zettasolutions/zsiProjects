CREATE TABLE plan_inclusions(
plan_inclusion_id	INT IDENTITY(1,1)	NOT NULL
,plan_id	INT	NOT NULL
,product_id	INT	NOT NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)