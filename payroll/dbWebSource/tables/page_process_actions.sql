CREATE TABLE page_process_actions(
page_process_action_id	INT IDENTITY(1,1)	NOT NULL
,page_process_id	INT	NOT NULL
,seq_no	INT	NOT NULL
,action_desc	VARCHAR(100)	NOT NULL
,status_id	INT	NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,next_process_id	INT	NULL
,is_end_process	CHAR(1)	NULL)