CREATE TABLE device_terms(
dm_term_id	INT IDENTITY(1,1)	NOT NULL
,device_model_id	INT	NULL
,term_id	INT	NULL
,base_monthly_amount	DECIMAL(12)	NULL
,interest_amount	DECIMAL(12)	NULL
,total_monthly_amount	DECIMAL(12)	NULL)