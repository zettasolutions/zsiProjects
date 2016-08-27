CREATE TABLE deductions_ref(
deduction_ref_id	INT IDENTITY(1,1)	NOT NULL
,deduction_code	VARCHAR(64)	NOT NULL
,deduction_desc	VARCHAR(64)	NOT NULL
,deduction_pct	DECIMAL(9)	NULL
,default_amt	DECIMAL(9)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)