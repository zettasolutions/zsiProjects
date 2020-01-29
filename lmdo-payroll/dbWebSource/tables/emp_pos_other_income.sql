CREATE TABLE emp_pos_other_income(
emp_pos_other_income_id	INT IDENTITY(1,1)	NOT NULL
,employee_id	INT	NULL
,position_id	INT	NULL
,other_income_id	INT	NOT NULL
,amount	DECIMAL(20)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)