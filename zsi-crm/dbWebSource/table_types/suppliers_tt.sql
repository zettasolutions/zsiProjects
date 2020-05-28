CREATE TYPE suppliers_tt AS TABLE(
supplier_id	INT	NULL
,supplier_code	CHAR(10)	NULL
,supplier_name	NVARCHAR(100)	NULL
,supplier_phone_no	NVARCHAR(40)	NULL
,supplier_mobile_no	NVARCHAR(40)	NULL
,supplier_email_add	NVARCHAR(60)	NULL
,billing_address	NVARCHAR(0)	NULL
,country_id	INT	NULL
,state_id_id	INT	NULL
,city_id_id	INT	NULL
,is_active	CHAR(1)	NULL
,bank_acct_no	NVARCHAR(40)	NULL
,is_tax_exempt	CHAR(1)	NULL
,payment_mode_id	INT	NULL)