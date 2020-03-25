CREATE TABLE classes(
class_id	INT IDENTITY(1,1)	NOT NULL
,class_code	NVARCHAR(40)	NOT NULL
,class_name	NVARCHAR(100)	NOT NULL
,class_desc	NVARCHAR(2000)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)