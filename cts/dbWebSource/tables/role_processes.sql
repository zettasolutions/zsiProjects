CREATE TABLE role_processes(
role_process_id	INT IDENTITY(1,1)	NOT NULL
,role_id	INT	NOT NULL
,process_id	INT	NOT NULL
,client_id	INT	NULL
,is_edit	CHAR(1)	NULL
,is_delete	CHAR(1)	NULL
,created_by	INT	NULL
,created_date	DATE	NULL
,updated_by	INT	NULL
,updated_date	DATE	NULL)