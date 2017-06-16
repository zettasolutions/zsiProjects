CREATE TABLE adjustment_types(
adjustment_type_id	INT IDENTITY(1,1)	NOT NULL
,adjustment_type	NVARCHAR(100)	NULL
,debit_credit	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)