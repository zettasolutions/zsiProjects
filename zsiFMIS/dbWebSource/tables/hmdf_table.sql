CREATE TABLE hmdf_table(
id	INT IDENTITY(1,1)	NOT NULL
,salary_fr	DECIMAL(20)	NOT NULL
,salary_to	DECIMAL(20)	NULL
,ee_pct_share	DECIMAL(20)	NULL
,er_pct_share	DECIMAL(20)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)