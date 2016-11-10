CREATE TYPE issuances_tt AS TABLE(
issuance_id	INT	NULL
,issuance_no	NVARCHAR(100)	NULL
,authority_id	INT	NULL
,issued_to_id	INT	NULL
,issued_by	INT	NULL
,issued_date	DATETIME	NULL
,issuance_directive_id	INT	NULL
,page_process_action_id	INT	NULL
,remarks	NVARCHAR(0)	NULL)