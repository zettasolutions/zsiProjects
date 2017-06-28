CREATE TABLE items_inv(
item_inv_id	INT IDENTITY(1,1)	NOT NULL
,item_code_id	INT	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,warehouse_id	INT	NULL)