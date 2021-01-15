CREATE TYPE device_terms_tt AS TABLE(
dm_term_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,device_model_id	INT	NULL
,term_id	INT	NULL
,base_monthly_amount	DECIMAL(12)	NULL
,interest_amount	DECIMAL(12)	NULL
,total_monthly_amount	DECIMAL(12)	NULL)