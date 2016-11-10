CREATE TABLE issuances(
issuance_id	INT IDENTITY(1,1)	NOT NULL
,issuance_no	NVARCHAR(100)	NULL
,authority_id	INT	NOT NULL
,issued_to_id	INT	NOT NULL
,issued_by	INT	NULL
,issued_date	DATETIME	NULL
,page_process_action_id	INT	NULL
,issuance_directive_id	INT	NULL
,remarks	NTEXT(2147483646)	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)