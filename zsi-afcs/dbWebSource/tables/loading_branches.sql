CREATE TABLE loading_branches(
loading_branch_id	INT IDENTITY(1,1)	NOT NULL
,company_id	INT	NULL
,hash_key	NVARCHAR(100)	NULL
,store_code	NCHAR(20)	NULL
,load_balance	DECIMAL(12)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)