CREATE TABLE requests(
request_id	INT IDENTITY(1,1)	NOT NULL
,request_no	NVARCHAR(100)	NULL
,client_id	INT	NULL
,app_id	INT	NULL
,request_desc	NVARCHAR(MAX)	NULL
,priority_level	NCHAR(2)	NULL
,process_id	INT	NULL
,status_id	INT	NULL
,remarks	NVARCHAR(MAX)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)