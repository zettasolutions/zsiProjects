CREATE TYPE employees_tt AS TABLE(
emp_id	INT	NULL
,employee_name	NVARCHAR(200)	NULL
,position	VARCHAR(50)	NULL
,d_rate	DECIMAL(20)	NULL
,area	VARCHAR(100)	NULL
,store_loc	VARCHAR(100)	NULL
,is_active	VARCHAR(1)	NULL)