CREATE TYPE ranks_tt AS TABLE(
rank_id	INT	NULL
,rank_code	NVARCHAR(20)	NULL
,rank_desc	NVARCHAR(1000)	NULL
,rank_level	INT	NULL
,is_active	NCHAR(2)	NULL)