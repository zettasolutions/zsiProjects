CREATE TABLE sss_table(
id	INT IDENTITY(1,1)	NOT NULL
,salary_fr	DECIMAL(20)	NOT NULL
,salary_to	DECIMAL(20)	NULL
,msc	DECIMAL(20)	NULL
,ssc_er	DECIMAL(20)	NULL
,ssc_ee	DECIMAL(20)	NULL
,ecc_er	DECIMAL(20)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)