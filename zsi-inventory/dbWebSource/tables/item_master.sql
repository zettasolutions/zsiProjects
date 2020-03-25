CREATE TABLE item_master(
item_id	INT IDENTITY(1,1)	NOT NULL
,item_code	NVARCHAR(40)	NOT NULL
,item_name	NVARCHAR(100)	NOT NULL
,item_desc	NVARCHAR(2000)	NULL
,item_category_id	INT	NULL
,item_class_id	INT	NULL
,item_type_id	INT	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)