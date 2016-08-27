CREATE TABLE suppliers(
supplier_id	INT IDENTITY(1,1)	NOT NULL
,supplier_name	VARCHAR(200)	NOT NULL
,contact_name	VARCHAR(200)	NOT NULL
,contact_no	VARCHAR(100)	NOT NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)