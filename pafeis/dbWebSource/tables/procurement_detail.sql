CREATE TABLE procurement_detail(
procurement_detail_id	INT IDENTITY(1,1)	NOT NULL
,procurement_id	INT	NOT NULL
,item_no	INT	NOT NULL
,item_code_id	INT	NOT NULL
,unit_of_measure_id	INT	NOT NULL
,quantity	FLOAT(8)	NOT NULL
,ordered_qty	FLOAT(8)	NULL
,unit_price	DECIMAL(20)	NULL
,amount	DECIMAL(20)	NULL
,total_delivered_quantity	FLOAT(8)	NULL
,balance_quantity	FLOAT(8)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,serial_no	NVARCHAR(60)	NULL)