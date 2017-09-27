CREATE TABLE employees(
employee_id	INT IDENTITY(1,1)	NOT NULL
,empoyee_no	NVARCHAR(40)	NULL
,last_name	NVARCHAR(100)	NULL
,first_name	NVARCHAR(100)	NULL
,middle_name	NVARCHAR(100)	NULL
,name_suffix	NVARCHAR(10)	NULL
,gender	CHAR(1)	NULL
,civil_status_code	CHAR(1)	NULL
,tax_status_id	INT	NULL
,date_hired	DATE	NULL
,department_id	INT	NOT NULL
,position_id	INT	NULL
,position_date	DATE	NULL
,employment_status_code	CHAR(1)	NULL
,basic_salary	DECIMAL(12)	NULL
,hourly_rate	DECIMAL(12)	NULL
,tax_exempt_amount	DECIMAL(20)	NULL
,pay_type_code	CHAR(1)	NULL
,card_no	NVARCHAR(100)	NULL)