CREATE TABLE receiving(
receiving_id	INT IDENTITY(1,1)	NOT NULL
,receiving_receipt_no	NVARCHAR(100)	NULL
,warehouse_id	INT	NOT NULL
,authority_id	INT	NOT NULL
,supply_source_id	INT	NOT NULL
,received_by	INT	NOT NULL
,received_date	DATETIME	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,status_id	INT	NULL
,status_remarks	NTEXT(2147483646)	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)