CREATE TYPE role_processes_tt AS TABLE(
role_process_id	INT	NULL
,role_id	INT	NULL
,is_edited	CHAR(1)	NULL
,is_deleted	CHAR(1)	NULL
,process_id	INT	NULL)