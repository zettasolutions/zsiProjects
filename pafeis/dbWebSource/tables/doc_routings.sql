CREATE TABLE doc_routings(
doc_routing_id	INT IDENTITY(1,1)	NOT NULL
,page_id	INT	NOT NULL
,doc_id	INT	NOT NULL
,seq_no	INT	NOT NULL
,role_id	INT	NOT NULL
,page_process_id	INT	NOT NULL
,page_process_action_id	INT	NULL
,acted_by	INT	NULL
,acted_date	DATETIME	NULL
,is_current	NCHAR(2)	NULL)