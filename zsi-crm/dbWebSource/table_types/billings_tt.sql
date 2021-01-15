CREATE TYPE billings_tt AS TABLE(
billing_period_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,billing_date	DATE	NULL
,billing_class_id	INT	NULL
,is_posted	CHAR(1)	NULL)