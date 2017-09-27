CREATE TABLE squadron_types(
squadron_type_id	INT	NOT NULL
,squadron_type	NVARCHAR(40)	NOT NULL
,is_active	NCHAR(2)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,page_id	INT	NULL)