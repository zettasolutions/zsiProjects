CREATE TABLE loading_branch_deposits(
loading_branch_deposit_id	INT IDENTITY(1,1)	NOT NULL
,loading_branch_id	INT	NULL
,deposit_date	DATE	NULL
,deposit_ref_no	NVARCHAR(100)	NULL
,deposit_amount	DECIMAL(12)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,posted_by	INT	NULL
,posted_date	DATETIME	NULL)