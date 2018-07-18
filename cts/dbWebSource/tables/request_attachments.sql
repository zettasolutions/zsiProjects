CREATE TABLE request_attachments(
request_attachment_id	INT IDENTITY(1,1)	NOT NULL
,attachment_name	NVARCHAR(100)	NOT NULL
,file_name	NVARCHAR(100)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIMEOFFSET	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIMEOFFSET	NULL)