CREATE TABLE other_income(
other_income_id	INT IDENTITY(1,1)	NOT NULL
,other_income_code	NVARCHAR(100)	NULL
,other_income_desc	NVARCHAR(400)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)