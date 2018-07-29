CREATE TABLE purchases(
purchase_id	INT IDENTITY(1,1)	NOT NULL
,player_id	NVARCHAR(100)	NOT NULL
,purchase_date	DATETIME	NOT NULL
,purchase_amount	DECIMAL(20)	NOT NULL
,service_charge_pct	DECIMAL(20)	NOT NULL
,service_charge_amt	DECIMAL(20)	NULL
,total_amount	DECIMAL(20)	NULL
,transaction_id	NVARCHAR(2000)	NULL
,transaction_status	NVARCHAR(1000)	NULL
,transaction_info	NVARCHAR(MAX)	NULL
,is_served	CHAR(1)	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)