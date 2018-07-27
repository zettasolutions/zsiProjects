CREATE TYPE subscriptions_tt AS TABLE(
subscription_id	INT	NULL
,is_edited	CHAR(1)	NULL
,app_id	INT	NULL
,subscription_date	DATE	NULL
,no_months	INT	NULL
,is_active	CHAR(1)	NULL)