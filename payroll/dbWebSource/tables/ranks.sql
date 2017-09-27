CREATE TABLE ranks(
rank_id	INT	NOT NULL
,rank_code	NVARCHAR(20)	NOT NULL
,rank_desc	NVARCHAR(1000)	NOT NULL
,rank_level	INT	NULL
,is_active	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)