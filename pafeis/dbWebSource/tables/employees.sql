CREATE TABLE employees(
employee_id	INT IDENTITY(1,1)	NOT NULL
,id_number	NVARCHAR(60)	NOT NULL
,first_name	NVARCHAR(100)	NOT NULL
,middle_name	NVARCHAR(100)	NOT NULL
,last_name	NVARCHAR(100)	NOT NULL
,name_suffix	NVARCHAR(20)	NULL
,civil_status	CHAR(1)	NULL
,contact_number	NVARCHAR(40)	NULL
,email	VARCHAR(50)	NULL
,gender	CHAR(1)	NULL
,wing_id	INT	NULL
,rank_id	INT	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIME	NULL
,updated_by	INT	NULL
,updated_date	DATETIME	NULL
,image	IMAGE(2147483647)	NULL)