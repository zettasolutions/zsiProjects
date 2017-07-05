CREATE TABLE item_status_quantity(
isq	INT IDENTITY(1,1)	NOT NULL
,item_inv_id	INT	NULL
,status_id	INT	NULL
,stock_qty	DECIMAL(12)	NULL
,bin	NVARCHAR(200)	NULL
,reserved_qty	DECIMAL(12)	NULL)