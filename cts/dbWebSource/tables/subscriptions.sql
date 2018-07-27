CREATE TABLE subscriptions(
subscription_id	INT IDENTITY(1,1)	NOT NULL
,subscription_date	DATE	NULL
,no_months	INT	NULL
,expiry_date	DATE	NULL
,app_id	INT	NOT NULL
,client_id	INT	NOT NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)