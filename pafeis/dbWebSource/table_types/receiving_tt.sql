CREATE TYPE receiving_tt AS TABLE(
receiving_id	INT	NULL
,receiving_no	INT	NULL
,invoice_no	NVARCHAR(100)	NULL
,invoice_date	DATETIME	NULL
,dr_no	NVARCHAR(100)	NULL
,dr_date	DATETIME	NULL
,dealer_id	INT	NULL
,receiving_organization_id	INT	NULL
,authority_id	INT	NULL
,transfer_organization_id	INT	NULL
,stock_transfer_no	INT	NULL
,received_by	INT	NULL
,received_date	DATETIME	NULL
,status_remarks	NVARCHAR(0)	NULL)