CREATE TABLE change_pass_requests(
email_add	NVARCHAR(100)	NOT NULL
,client_id	INT	NOT NULL
,confirmation_code	NVARCHAR(100)	NOT NULL
,request_date	DATETIME	NOT NULL)