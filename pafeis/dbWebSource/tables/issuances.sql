CREATE TABLE issuances(
issuance_id	INT IDENTITY(1,1)	NOT NULL
,issuance_no	NVARCHAR(100)	NULL
,organization_id	INT	NULL
,issued_by	INT	NULL
,issued_date	DATETIME	NULL
,issuance_directive_code	NVARCHAR(2000)	NULL
,authority_ref	NVARCHAR(2000)	NULL
,aircraft_id	INT	NULL
,status_id	INT	NULL
,status_remarks	NVARCHAR(MAX)	NULL
,transfer_warehouse_id	INT	NULL
,issuance_type	VARCHAR(20)	NULL
,warehouse_id	INT	NULL
,dealer_id	INT	NULL
,img_filename	NVARCHAR(150)	NULL
,accepted_by	INT	NULL
,issued_to_organization_id	INT	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)