CREATE TYPE plans_tt AS TABLE(
plan_id	INT	NULL
,is_edited	CHAR(1)	NULL
,product_id	INT	NULL
,plan_srp	DECIMAL(12)	NULL
,plan_dp	DECIMAL(12)	NULL
,plan_start_date	DATE	NULL
,plan_end_date	DATE	NULL
,is_promo	CHAR(1)	NULL
,is_active	CHAR(1)	NULL)