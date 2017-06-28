CREATE TABLE pages(
page_id	INT IDENTITY(1,1)	NOT NULL
,page_name	NVARCHAR(100)	NULL
,page_title	NVARCHAR(200)	NULL
,master_page_id	INT	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)