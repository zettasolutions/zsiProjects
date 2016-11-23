CREATE TABLE page_process_action_procs(
page_process_action_proc_id	INT IDENTITY(1,1)	NOT NULL
,page_process_action_id	INT	NOT NULL
,seq_no	INT	NULL
,proc_name	VARCHAR(100)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,class_container	VARCHAR(50)	NULL)