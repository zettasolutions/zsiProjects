CREATE TYPE page_processes_tt AS TABLE(
page_process_id	INT	NULL
,page_id	INT	NULL
,seq_no	INT	NULL
,process_desc	VARCHAR(100)	NULL
,role_id	INT	NULL
,is_active	CHAR(1)	NULL
,is_default	CHAR(1)	NULL)