CREATE TABLE client_contracts(
client_contract_id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NULL
,contract_no	NVARCHAR(100)	NULL
,contract_date	DATE	NULL
,expiry_date	DATE	NULL
,no_subscriptions	INT	NULL
,plan_id	INT	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)