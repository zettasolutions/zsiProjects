CREATE TYPE pages_tt AS TABLE(
page_id	INT	NULL
,page_name	NVARCHAR(100)	NULL
,page_title	NVARCHAR(200)	NULL
,is_public	CHAR(1)	NULL
,master_page_id	INT	NULL)