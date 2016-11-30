CREATE TABLE receiving_details(
receiving_detail_id	INT IDENTITY(1,1)	NOT NULL
,receiving_id	INT	NOT NULL
,item_id	INT	NOT NULL
,serial_no	VARCHAR(50)	NULL
,unit_of_measure_id	INT	NOT NULL
,quantity	DECIMAL(20)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,remarks	NTEXT(2147483646)	NULL
,item_class_id	INT	NULL)