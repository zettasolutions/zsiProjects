CREATE TABLE client_billings(
client_billing_id	INT IDENTITY(1,1)	NOT NULL
,client_id	INT	NOT NULL
,client_billing_no	INT	NOT NULL
,billing_period_id	INT	NOT NULL
,current_billing_amount	DECIMAL(12)	NOT NULL
,prev_balance_amount	DECIMAL(12)	NULL
,gross_amount	DECIMAL(12)	NULL
,tax_amount	DECIMAL(12)	NULL
,net_amount	DECIMAL(12)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)