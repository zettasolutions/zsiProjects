CREATE TYPE requests_tt AS TABLE(
request_id	INT	NULL
,is_edited	CHAR(1)	NULL
,client_id	INT	NULL
,app_id	INT	NULL
,request_desc	NVARCHAR(0)	NULL
,priority_level	NCHAR(2)	NULL
,process_id	INT	NULL
,status_id	INT	NULL
,remarks	NVARCHAR(0)	NULL)