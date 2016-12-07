CREATE TYPE issuances_tt AS TABLE(
issuance_id	INT	NULL
,organization_id	INT	NULL
,issuance_no	NVARCHAR(100)	NULL
,issued_by	INT	NULL
,issued_date	DATETIME	NULL
,issuance_directive_id	INT	NULL
,aircraft_id	INT	NULL
,transfer_organization_id	INT	NULL
,authority_ref	NVARCHAR(2000)	NULL
,status_id	INT	NULL
,status_remarks	NVARCHAR(0)	NULL)