CREATE TYPE departments_tt AS TABLE(
department_id	INT	NULL
,is_edited	CHAR(1)	NULL
,department_code	NVARCHAR(40)	NULL
,department_name	VARCHAR(50)	NULL
,is_active	CHAR(1)	NULL)