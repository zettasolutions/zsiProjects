CREATE TABLE procurement_detail(
procurement_detail_id	INT IDENTITY(1,1)	NOT NULL
,procurement_id	INT	NOT NULL
,item_sequence	INT	NOT NULL
,item_code	NVARCHAR(100)	NOT NULL
,item_id	INT	NOT NULL
,unit_of_measure_id	INT	NOT NULL
,quantity	INT	NOT NULL
,unit_price	DECIMAL(20)	NOT NULL
,amount	DECIMAL(20)	NOT NULL
,total_delivered_quantity	INT	NULL
,balance_quantity	INT	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)