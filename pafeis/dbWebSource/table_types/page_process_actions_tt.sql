CREATE TYPE page_process_actions_tt AS TABLE(
page_process_action_id	INT	NULL
,page_process_id	INT	NULL
,seq_no	INT	NULL
,action_desc	VARCHAR(100)	NULL
,status_id	INT	NULL)