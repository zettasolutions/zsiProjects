CREATE TYPE issuances_tt AS TABLE(
issuance_id	INT	NULL
,is_edited	CHAR(1)	NULL
,organization_id	INT	NULL
,issuance_no	NVARCHAR(100)	NULL
,issued_by	INT	NULL
,issued_date	DATETIME	NULL
,issuance_directive_id	INT	NULL
,aircraft_id	INT	NULL
,transfer_warehouse_id	INT	NULL
,dealer_id	INT	NULL
,authority_ref	NVARCHAR(2000)	NULL
,status_id	INT	NULL
,status_remarks	NVARCHAR(0)	NULL
,issuance_type	NVARCHAR(200)	NULL)