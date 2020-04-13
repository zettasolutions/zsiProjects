CREATE TYPE emp_pos_other_income_tt AS TABLE(
emp_pos_other_income_id	INT	NULL
,is_edited	CHAR(1)	NULL
,employee_id	INT	NULL
,position_id	INT	NULL
,other_income_id	INT	NULL
,amount	DECIMAL(20)	NULL)