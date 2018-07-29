CREATE TABLE cash_outs(
cash_out_id	INT IDENTITY(1,1)	NOT NULL
,cash_out_date	DATETIME	NOT NULL
,player_id	DATETIME	NOT NULL
,cash_out_amount	DECIMAL(20)	NOT NULL
,service_charge_pct	INT	NOT NULL
,cash_out_act_amount	DECIMAL(20)	NOT NULL
,card_type	NVARCHAR(100)	NOT NULL
,card_no	NVARCHAR(1000)	NOT NULL
,card_name	NVARCHAR(1000)	NULL
,transaction_id	NVARCHAR(1000)	NULL
,transaction_status	NVARCHAR(1000)	NULL
,transaction_date	NVARCHAR(1000)	NULL)