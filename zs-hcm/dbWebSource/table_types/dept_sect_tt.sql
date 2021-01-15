CREATE TYPE dept_sect_tt AS TABLE(
dept_sect_id	INT	NULL
,dept_sect_parent_id	INT	NULL
,is_edited	CHAR(1)	NULL
,dept_sect_code	NVARCHAR(40)	NULL
,dept_sect_name	VARCHAR(50)	NULL
,is_active	CHAR(1)	NULL)