CREATE TYPE deductions_ref_tt AS TABLE(
deduction_ref_id	INT	NULL
,deduction_code	VARCHAR(64)	NULL
,deduction_desc	VARCHAR(64)	NULL
,deduction_pct	DECIMAL(9)	NULL
,default_amt	DECIMAL(9)	NULL)