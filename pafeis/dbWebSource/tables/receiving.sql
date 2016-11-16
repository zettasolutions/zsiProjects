CREATE TABLE receiving(
receiving_id	INT IDENTITY(1,1)	NOT NULL
,receiving_no	INT	NULL
,invoice_no	NVARCHAR(100)	NULL
,invoice_date	DATETIME	NULL
,dr_no	NVARCHAR(100)	NULL
,dr_date	DATETIME	NULL
,dealer_id	INT	NULL
,receiving_organization_id	INT	NOT NULL
,authority_id	INT	NOT NULL
,transfer_organization_id	INT	NULL
,stock_transfer_no	INT	NULL
,received_by	INT	NULL
,received_date	DATETIME	NULL
,status_id	NTEXT(2147483646)	NULL
,status_remarks	NTEXT(2147483646)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)