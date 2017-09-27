CREATE TABLE positions(
position_id	INT IDENTITY(1,1)	NOT NULL
,position_code	NVARCHAR(20)	NOT NULL
,position	NVARCHAR(1000)	NOT NULL
,is_active	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)