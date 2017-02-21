CREATE TYPE doc_routing_tt AS TABLE(
doc_routing_id	INT	NULL
,page_id	INT	NULL
,doc_id	INT	NULL
,seq_no	INT	NULL
,role_id	INT	NULL
,page_process_id	INT	NULL
,page_process_action_id	INT	NULL
,status_id	INT	NULL
,acted_by	INT	NULL
,acted_date	DATETIME	NULL
,is_current	CHAR(1)	NULL)