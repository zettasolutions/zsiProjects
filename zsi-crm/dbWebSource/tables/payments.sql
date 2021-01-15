CREATE TABLE payments(
payment_id	INT IDENTITY(1,1)	NOT NULL
,payment_date	DATE	NULL
,client_id	INT	NULL
,billing_id	INT	NULL
,check_no	NVARCHAR(100)	NULL
,check_date	DATE	NULL
,is_post_dated	CHAR(1)	NULL
,or_no	NVARCHAR(100)	NULL
,or_amount	DECIMAL(12)	NULL
,posted_date	DATETIME	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)