CREATE TABLE temp_item_codes(
user_id	INT	NULL
,item_category	NVARCHAR(100)	NULL
,item_type	NVARCHAR(100)	NULL
,part_no	NVARCHAR(100)	NULL
,national_stock_no	NVARCHAR(100)	NULL
,item_name	NVARCHAR(400)	NULL
,reorder_level	INT	NULL
,id	INT IDENTITY(1,1)	NOT NULL)