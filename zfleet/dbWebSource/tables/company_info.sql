CREATE TABLE company_info(
company_id	INT IDENTITY(1,1)	NOT NULL
,registration_code	NVARCHAR(100)	NULL
,company_code	NVARCHAR(100)	NULL
,company_name	NVARCHAR(100)	NULL
,company_address	NVARCHAR(2000)	NULL
,company_contact	NVARCHAR(100)	NULL
,company_mobile	NVARCHAR(100)	NULL
,company_landline	NVARCHAR(100)	NULL
,company_tin	NVARCHAR(100)	NULL
,company_logo	NVARCHAR(100)	NULL)