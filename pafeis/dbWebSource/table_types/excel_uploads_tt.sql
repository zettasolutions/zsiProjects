CREATE TYPE excel_uploads_tt AS TABLE(
id	INT	NULL
,seq_no	INT	NULL
,temp_table	VARCHAR(50)	NULL
,excel_column_range	VARCHAR(100)	NULL
,load_name	VARCHAR(50)	NULL
,redirect_page	NVARCHAR(200)	NULL
,insert_proc	NVARCHAR(200)	NULL)