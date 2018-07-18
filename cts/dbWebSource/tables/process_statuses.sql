CREATE TABLE process_statuses(
process_status_id	INT IDENTITY(1,1)	NOT NULL
,process_id	INT	NOT NULL
,seq_no	INT	NULL
,status_id	INT	NOT NULL
,button_text	NVARCHAR(100)	NULL
,next_process_id	INT	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)