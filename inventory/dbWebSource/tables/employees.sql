CREATE TABLE employees(
emp_id	INT IDENTITY(1,1)	NOT NULL
,employee_name	NVARCHAR(60)	NULL
,position	VARCHAR(50)	NULL
,d_rate	DECIMAL(20)	NULL
,area	VARCHAR(50)	NULL
,store_loc	VARCHAR(50)	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)