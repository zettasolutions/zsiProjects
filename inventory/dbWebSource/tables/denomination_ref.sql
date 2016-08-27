CREATE TABLE denomination_ref(
denomination_id	INT IDENTITY(1,1)	NOT NULL
,denomination	DECIMAL(12)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)