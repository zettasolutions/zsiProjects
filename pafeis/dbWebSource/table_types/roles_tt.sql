CREATE TYPE roles_tt AS TABLE(
role_id	INT	NULL
,is_edited	VARCHAR(1)	NULL
,role_name	NVARCHAR(40)	NULL
,is_export_excel	VARCHAR(1)	NULL
,is_export_pdf	VARCHAR(1)	NULL
,is_import_excel	VARCHAR(1)	NULL)