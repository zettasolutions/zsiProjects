CREATE TABLE issuances(
issuance_id	INT IDENTITY(1,1)	NOT NULL
,issuance_no	NVARCHAR(100)	NULL
,organization_id	INT	NULL
,issued_by	INT	NULL
,issued_date	DATETIME	NULL
,issuance_directive_id	INT	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,aircraft_id	INT	NULL
,status_id	INT	NULL
,status_remarks	NTEXT(2147483646)	NULL
,authority_ref	NVARCHAR(2000)	NULL
,transfer_organization_id	INT	NULL
,issuance_type	VARCHAR(20)	NULL)