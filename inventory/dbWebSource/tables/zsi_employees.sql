CREATE TABLE zsi_employees(
employee_id	INT IDENTITY(1,1)	NOT NULL
,user_id	INT	NULL
,first_name	VARCHAR(100)	NOT NULL
,middle_name	VARCHAR(100)	NOT NULL
,last_name	VARCHAR(100)	NOT NULL
,name_suffix	VARCHAR(5)	NULL
,birth_date	DATETIME	NOT NULL
,gender	CHAR(1)	NOT NULL
,marital_status	CHAR(1)	NOT NULL
,position_id	INT	NOT NULL
,present_address	TEXT(2147483647)	NULL
,provincial_address	TEXT(2147483647)	NULL
,contact_no	VARCHAR(15)	NULL
,email_address	VARCHAR(300)	NULL
,emergency_contact_person	VARCHAR(300)	NULL
,emergency_contact_no	VARCHAR(15)	NULL
,is_active	CHAR(1)	NOT NULL
,created_by	INT	NOT NULL
,created_date	DATETIME	NOT NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL)