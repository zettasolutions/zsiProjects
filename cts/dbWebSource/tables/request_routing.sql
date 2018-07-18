CREATE TABLE request_routing(
request_routing_id	INT IDENTITY(1,1)	NOT NULL
,process_id	INT	NOT NULL
,request_id	INT	NOT NULL
,status_id	INT	NULL
,remarks	NVARCHAR(MAX)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL)