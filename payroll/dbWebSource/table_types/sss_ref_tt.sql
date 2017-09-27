CREATE TYPE sss_ref_tt AS TABLE(
sss_ref_id	INT	NULL
,is_edited	CHAR(1)	NULL
,salary_from	DECIMAL(20)	NULL
,salary_to	DECIMAL(20)	NULL
,ms_credit	DECIMAL(20)	NULL
,ss_er	DECIMAL(20)	NULL
,ss_ee	DECIMAL(20)	NULL
,ss_total	DECIMAL(20)	NULL
,ec_er	DECIMAL(20)	NULL
,contribution_er	DECIMAL(20)	NULL
,contribution_ee	DECIMAL(20)	NULL
,contribution_total	DECIMAL(20)	NULL)