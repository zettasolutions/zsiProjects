CREATE TABLE physical_inv_details(
physical_inv_detail_id	INT IDENTITY(1,1)	NOT NULL
,physical_inv_id	INT	NOT NULL
,item_code_id	INT	NULL
,quantity	DECIMAL(20)	NOT NULL
,bin	NVARCHAR(200)	NULL
,remarks	NTEXT(2147483646)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)