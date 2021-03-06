CREATE TABLE receiving(
receiving_id	INT IDENTITY(1,1)	NOT NULL
,receiving_no	NVARCHAR(100)	NULL
,doc_no	NVARCHAR(100)	NULL
,doc_date	DATETIME	NULL
,dealer_id	INT	NULL
,issuance_warehouse_id	INT	NULL
,aircraft_id	INT	NULL
,received_by	INT	NULL
,received_date	DATETIME	NULL
,status_remarks	NVARCHAR(MAX)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,status_id	INT	NULL
,authority_ref	NVARCHAR(200)	NULL
,receiving_type	VARCHAR(20)	NULL
,warehouse_id	INT	NULL
,procurement_id	INT	NULL
,supply_source_id	INT	NULL
,donor	NVARCHAR(200)	NULL
,issuance_organization_id	INT	NULL)