CREATE TYPE sys_requests_tt AS TABLE(
ticket_id	INT	NULL
,is_edited	CHAR(1)	NULL
,requested_by	INT	NULL
,request_type_id	INT	NULL
,request_desc	NVARCHAR(0)	NULL
,is_urgent	CHAR(1)	NULL
,status_id	INT	NULL)