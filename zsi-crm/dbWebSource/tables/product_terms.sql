CREATE TABLE product_terms(
product_term_id	INT IDENTITY(1,1)	NOT NULL
,product_id	INT	NULL
,term_id	INT	NULL
,interest_pct	DECIMAL(12)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)