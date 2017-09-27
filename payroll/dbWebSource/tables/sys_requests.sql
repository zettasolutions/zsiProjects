CREATE TABLE sys_requests(
ticket_id	INT IDENTITY(1,1)	NOT NULL
,ticket_date	DATETIME	NOT NULL
,requested_by	INT	NOT NULL
,request_desc	NVARCHAR(MAX)	NOT NULL
,request_type_id	INT	NOT NULL
,is_urgent	CHAR(1)	NULL
,status_id	INT	NOT NULL
,img_filename	NVARCHAR(MAX)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)