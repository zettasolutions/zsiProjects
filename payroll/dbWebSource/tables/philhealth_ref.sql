CREATE TABLE philhealth_ref(
philhealth_id	INT IDENTITY(1,1)	NOT NULL
,salary_from	DECIMAL(12)	NULL
,salary_to	DECIMAL(12)	NULL
,share_amount	DECIMAL(12)	NULL
,premium_amount	DECIMAL(12)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)