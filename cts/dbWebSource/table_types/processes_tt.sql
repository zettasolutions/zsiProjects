CREATE TYPE processes_tt AS TABLE(
process_id	INT	NULL
,is_edited	CHAR(1)	NULL
,seq_no	INT	NULL
,process_title	NVARCHAR(100)	NULL
,icon	NVARCHAR(100)	NULL
,process_desc	NVARCHAR(0)	NULL
,category_id	INT	NULL
,type_id	INT	NULL
,is_active	CHAR(1)	NULL)