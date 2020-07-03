CREATE TABLE company_info(
company_id	INT IDENTITY(1,1)	NOT NULL
,registration_code	NVARCHAR(100)	NULL
,company_code	NVARCHAR(40)	NULL
,company_name	NVARCHAR(100)	NOT NULL
,contact_name	NVARCHAR(100)	NOT NULL
,company_landline	NVARCHAR(100)	NOT NULL
,company_mobile	NVARCHAR(100)	NULL
,company_tin	NVARCHAR(100)	NOT NULL
,email_add	NVARCHAR(100)	NULL
,bank_id	INT	NULL
,account_no	NVARCHAR(40)	NULL
,company_address	NVARCHAR(2000)	NOT NULL
,city_id	INT	NULL
,company_logo	NVARCHAR(100)	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL
,is_zfare	CHAR(1)	NULL
,is_zload	CHAR(1)	NULL
,load_balance_amt	DECIMAL(12)	NULL)