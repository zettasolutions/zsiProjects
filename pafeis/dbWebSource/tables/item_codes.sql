CREATE TABLE item_codes(
item_code_id	INT IDENTITY(1,1)	NOT NULL
,item_type_id	INT	NOT NULL
,part_no	NVARCHAR(120)	NULL
,national_stock_no	NVARCHAR(120)	NULL
,item_name	NVARCHAR(200)	NOT NULL
,critical_level	INT	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,reorder_level	INT	NULL
,item_code	NVARCHAR(200)	NULL)