CREATE TABLE dept_sect_0(
dept_sect_id	INT IDENTITY(1,1)	NOT NULL
,dept_sect_code	NVARCHAR(40)	NULL
,dept_sect_name	NVARCHAR(100)	NULL
,dept_sect_parent_id	INT	NULL
,is_active	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATETIMEOFFSET	NULL
,updated_by	INT	NULL
,updated_date	DATETIMEOFFSET	NULL)