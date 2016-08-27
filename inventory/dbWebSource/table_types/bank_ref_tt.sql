CREATE TYPE bank_ref_tt AS TABLE(
bank_ref_id	INT	NULL
,bank_acctno	VARCHAR(30)	NOT NULL
,bank_acctname	VARCHAR(50)	NOT NULL
,bank_name	VARCHAR(50)	NOT NULL
,acct_amount	DECIMAL(12)	NULL
,depo_pct_share	INT	NULL
,priority_no	INT	NULL
,active	CHAR(1)	NOT NULL)