CREATE TABLE sss_ref(
sss_ref_id	INT IDENTITY(1,1)	NOT NULL
,salary_from	DECIMAL(20)	NULL
,salary_to	DECIMAL(20)	NULL
,ms_credit	DECIMAL(20)	NULL
,ss_er	DECIMAL(20)	NULL
,ss_ee	DECIMAL(20)	NULL
,ss_total	DECIMAL(20)	NULL
,ec_er	DECIMAL(20)	NULL
,contribution_er	DECIMAL(20)	NULL
,contribution_ee	DECIMAL(20)	NULL
,contribution_total	DECIMAL(20)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)