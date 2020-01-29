CREATE TABLE philhealth_table(
philhealth_id	INT IDENTITY(1,1)	NOT NULL
,salary_fr	DECIMAL(20)	NOT NULL
,salary_to	DECIMAL(20)	NULL
,salary_base	DECIMAL(20)	NULL
,total_monthly_premium	DECIMAL(20)	NULL
,ee_share	DECIMAL(20)	NULL
,er_share	DECIMAL(20)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)