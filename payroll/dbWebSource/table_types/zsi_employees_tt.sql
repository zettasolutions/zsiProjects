CREATE TYPE zsi_employees_tt AS TABLE(
employee_id	INT	NULL
,first_name	VARCHAR(100)	NULL
,middle_name	VARCHAR(100)	NULL
,last_name	VARCHAR(100)	NULL
,name_suffix	VARCHAR(5)	NULL
,birth_date	DATETIME	NULL
,gender	CHAR(1)	NULL
,marital_status	CHAR(1)	NULL
,user_id	INT	NULL
,position_id	INT	NULL
,present_address	VARCHAR(0)	NULL
,provincial_address	VARCHAR(0)	NULL
,contact_no	VARCHAR(15)	NULL
,email_address	VARCHAR(300)	NULL
,emergency_contact_person	VARCHAR(300)	NULL
,emergency_contact_no	VARCHAR(15)	NULL
,is_active	CHAR(1)	NULL)