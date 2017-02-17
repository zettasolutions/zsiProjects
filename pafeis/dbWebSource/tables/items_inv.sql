CREATE TABLE items_inv(
item_inv_id	INT IDENTITY(1,1)	NOT NULL
,item_code_id	INT	NOT NULL
,stock_qty	DECIMAL(12)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,bin_id	INT	NULL
,warehouse_id	INT	NULL)