CREATE TABLE tax_table(
id	NCHAR(20)	NOT NULL
,pay_type_code	CHAR(1)	NULL
,cl_fr	DECIMAL(20)	NOT NULL
,cl_to	DECIMAL(20)	NULL
,cl	DECIMAL(20)	NULL
,add_pct_cl	DECIMAL(20)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)