CREATE TYPE issuance_directive_tt AS TABLE(
issuance_directive_id	INT	NULL
,issuance_directive_no	NVARCHAR(100)	NULL
,issued_directive_from_id	INT	NULL
,issued_directive_to_id	INT	NULL
,attached_filename	NVARCHAR(600)	NULL
,process_id	INT	NULL
,action_id	INT	NULL)