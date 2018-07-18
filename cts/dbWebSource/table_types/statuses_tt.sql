CREATE TYPE statuses_tt AS TABLE(
status_id	INT	NULL
,is_edited	CHAR(1)	NULL
,is_edit	CHAR(1)	NULL
,seq_no	INT	NULL
,status_code	VARCHAR(10)	NULL
,status_name	VARCHAR(300)	NULL
,status_color	VARCHAR(20)	NULL
,icon	NVARCHAR(100)	NULL
,is_active	CHAR(1)	NULL)