CREATE TYPE process_statuses_tt AS TABLE(
process_status_id	INT	NULL
,process_id	INT	NULL
,is_edited	CHAR(1)	NULL
,seq_no	INT	NULL
,status_id	INT	NULL
,button_text	NVARCHAR(100)	NULL
,next_process_id	INT	NULL
,is_active	CHAR(1)	NULL)