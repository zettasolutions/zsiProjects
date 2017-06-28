CREATE TABLE issuance_details(
issuance_detail_id	INT IDENTITY(1,1)	NOT NULL
,issuance_id	INT	NOT NULL
,serial_no	NVARCHAR(60)	NULL
,aircraft_id	INT	NULL
,quantity	DECIMAL(20)	NOT NULL
,remarks	NVARCHAR(MAX)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,item_inv_id	INT	NULL
,item_status_id	INT	NULL)