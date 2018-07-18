CREATE TABLE processes(
process_id	INT IDENTITY(1,1)	NOT NULL
,seq_no	INT	NOT NULL
,client_id	INT	NULL
,icon	NVARCHAR(100)	NULL
,process_title	NVARCHAR(100)	NOT NULL
,process_desc	NVARCHAR(MAX)	NULL
,category_id	INT	NULL
,type_id	INT	NULL
,is_default	CHAR(1)	NULL
,is_active	CHAR(1)	NOT NULL
,is_createdby_only	NCHAR(20)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)