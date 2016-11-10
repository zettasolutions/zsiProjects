CREATE TABLE item_class(
item_class_id	INT IDENTITY(1,1)	NOT NULL
,item_class_code	NVARCHAR(30)	NOT NULL
,item_class_name	NVARCHAR(100)	NOT NULL
,is_active	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)