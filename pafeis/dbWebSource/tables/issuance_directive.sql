CREATE TABLE issuance_directive(
issuance_directive_id	INT IDENTITY(1,1)	NOT NULL
,issuance_directive_no	NVARCHAR(100)	NULL
,issued_directive_from_id	INT	NOT NULL
,issued_directive_to_id	INT	NOT NULL
,attached_filename	NVARCHAR(600)	NULL
,process_id	INT	NOT NULL
,action_id	INT	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)