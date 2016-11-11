CREATE TYPE employees_tt AS TABLE(
employee_id	INT	NULL
,id_number	NVARCHAR(20)	NULL
,last_name	NVARCHAR(200)	NULL
,first_name	NVARCHAR(200)	NULL
,middle_name	NVARCHAR(200)	NULL
,name_suffix	NVARCHAR(20)	NULL
,civil_status	CHAR(1)	NULL
,contact_number	VARCHAR(100)	NULL
,email	NVARCHAR(600)	NULL
,gender	CHAR(1)	NULL
,wing_id	INT	NULL
,squadron_id	INT	NULL
,rank_id	INT	NULL
,is_active	VARCHAR(1)	NULL)