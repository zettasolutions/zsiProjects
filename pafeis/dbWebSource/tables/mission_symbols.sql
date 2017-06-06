CREATE TABLE mission_symbols(
ms_id	INT IDENTITY(1,1)	NOT NULL
,ms_code	NVARCHAR(20)	NULL
,ms_description	NVARCHAR(100)	NULL
,ms_classification_code	NVARCHAR(2)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)