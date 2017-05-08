CREATE TYPE statuses_tt AS TABLE(
status_id	INT	NULL
,is_edited	CHAR(1)	NULL
,status_code	VARCHAR(10)	NULL
,status_name	VARCHAR(300)	NULL
,status_color	VARCHAR(20)	NULL
,is_item	CHAR(1)	NULL
,is_aircraft	CHAR(1)	NULL
,is_process	CHAR(1)	NULL
,is_returned	CHAR(1)	NULL
,is_active	CHAR(1)	NULL)