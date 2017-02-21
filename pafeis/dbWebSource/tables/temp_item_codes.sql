CREATE TABLE temp_item_codes(
user_id	INT	NULL
,item_type	NVARCHAR(100)	NOT NULL
,part_no	NVARCHAR(60)	NULL
,national_stock_no	NVARCHAR(60)	NULL
,item_name	NVARCHAR(100)	NOT NULL
,critical_level	INT	NULL
,reorder_level	INT	NULL
,id	INT IDENTITY(1,1)	NOT NULL)