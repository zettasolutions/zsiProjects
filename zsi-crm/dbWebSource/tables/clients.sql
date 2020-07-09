CREATE TABLE clients(
client_id	INT IDENTITY(1,1)	NOT NULL
,hash_key	NVARCHAR(200)	NOT NULL
,client_code	CHAR(10)	NOT NULL
,client_name	NVARCHAR(100)	NOT NULL
,client_phone_no	NVARCHAR(40)	NULL
,client_mobile_no	NVARCHAR(40)	NULL
,client_email_add	NVARCHAR(60)	NULL
,billing_address	NTEXT(2147483646)	NULL
,country_id	INT	NULL
,state_id	INT	NULL
,city_id	INT	NULL
,registration_date	DATE	NULL
,account_exec_id	INT	NULL
,billing_class_id	INT	NULL
,bank_acct_no	NVARCHAR(40)	NULL
,bank_id	INT	NULL
,is_tax_exempt	CHAR(1)	NULL
,client_tin	NVARCHAR(40)	NULL
,payment_mode_id	INT	NULL
,balance_amount	DECIMAL(12)	NULL
,main_id	INT	NULL
,is_active	CHAR(1)	NULL
,is_zfare	CHAR(1)	NULL
,is_zload	CHAR(1)	NULL
,company_logo	NVARCHAR(200)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)