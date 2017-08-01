CREATE TABLE temp_item_codes(
user_id	INT	NULL
,item_category	NVARCHAR(100)	NULL
,part_no	NVARCHAR(100)	NULL
,national_stock_no	NVARCHAR(100)	NULL
,item_name	NVARCHAR(400)	NULL
,reorder_level	INT	NULL
,critical_level	INT	NULL
,uom	NVARCHAR(100)	NULL
,monitoring_type	NVARCHAR(100)	NULL
,is_repairable	CHAR(1)	NULL
,id	INT IDENTITY(1,1)	NOT NULL)