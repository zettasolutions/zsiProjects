CREATE TABLE posting_dates(
id	INT IDENTITY(1,1)	NOT NULL
,posted_date	DATETIME	NULL
,company_code	NVARCHAR(20)	NULL
,bank_transfer_id	INT	NULL
,posted_amount	DECIMAL(20)	NULL
,created_by	INT	NULL)