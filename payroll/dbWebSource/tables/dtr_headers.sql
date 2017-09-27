CREATE TABLE dtr_headers(
dtr_hdr_id	INT IDENTITY(1,1)	NOT NULL
,employee_id	INT	NULL
,cut_off_id	INT	NULL
,shift_id	INT	NULL
,reg_hours	DECIMAL(12)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)