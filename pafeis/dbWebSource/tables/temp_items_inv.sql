CREATE TABLE temp_items_inv(
user_id	INT	NULL
,warehouse_id	INT	NULL
,part_no	NVARCHAR(60)	NULL
,national_stock_no	NVARCHAR(60)	NULL
,item_name	NVARCHAR(100)	NOT NULL
,quantity	DECIMAL(12)	NULL
,status	NVARCHAR(100)	NULL
,id	INT IDENTITY(1,1)	NOT NULL)